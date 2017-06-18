'use strict';

const fs = require('fs');
const path = require('path');
const Buffer = require('buffer').Buffer;

const { json } = require('micro');
const microDispatch = require('micro-route/dispatch');
const pow = require('proof-of-work');
const Joi = require('joi');

const DB = require('./lib/db');
const PREFIX = Buffer.from('vote.now', 'utf8');
const HEX_PREFIX = PREFIX.toString('hex');

const COMPLEXITY = 20;

const MAX_ID_LENGTH = 64;

function App() {
  const VALIDITY = 60000;

  this.verifier = new pow.Verifier({
    // Probability = 1e-11
    size: 64 * 1024 * 1024,
    n: 37,
    complexity: COMPLEXITY,
    prefix: PREFIX,
    validity: VALIDITY
  });

  setInterval(() => {
    this.verifier.reset();
  }, 2 * VALIDITY);

  this.db = new DB(process.env.DB);
}

const CORS_HEADERS = [
  { key: 'access-control-allow-origin', value: '*' },
  { key: 'access-control-allow-methods', value: 'GET, PUT' },
  { key: 'access-control-allow-headers', value: 'content-type' }
];

App.prototype.setCORSHeaders = function setCORSHeaders(res) {
  CORS_HEADERS.forEach(header => res.setHeader(header.key, header.value));
};

App.prototype.dispatch = function dispatch() {
  return microDispatch()
      .dispatch('*', 'OPTIONS', (req, res) => this.serveCORS(req, res))
      .dispatch('/', 'GET', (req, res) => this.serveHome(req, res))
      .dispatch('/api/v1/', 'GET', (req, res) => {
        this.setCORSHeaders(res);
        return {
          prefix: HEX_PREFIX,
          complexity: COMPLEXITY,
          endpoints: {
            '/api/v1/': { method: 'GET' },
            '/api/v1/vote/:id': [
              { method: 'GET' },
              { method: 'PUT', body: { nonce: 'hex' } }
            ]
          }
        };
      })
      .dispatch('/api/v1/vote/:id', 'GET', async (req, res, { params }) => {
        this.setCORSHeaders(res);
        if (params.id.length > MAX_ID_LENGTH)
          return { error: 'id overflow' };
        return await this.getVotes(params.id);
      })
      .dispatch('/api/v1/vote/:id', 'PUT', async (req, res, { params }) => {
        this.setCORSHeaders(res);
        if (params.id.length > MAX_ID_LENGTH)
          return { error: 'id overflow' };
        const body = await json(req);
        return this.vote(params.id, body);
      })
      .otherwise(() => ({ error: 'Invalid endpoint' }));
};

App.prototype.serveCORS = function serveCORS(req, res) {
  this.setCORSHeaders(res);
  res.writeHead(200, {
    'content-length': 0
  });
  res.end();
};

App.prototype.serveHome = function serveHome(req, res) {
  res.writeHead(301, {
    location: 'https://indutny.github.io/vote.now/',
    'content-type': 'text/html'
  });
  res.end(`Redirecting to
          <a href="https://indutny.github.io/vote.now/">
            https://indutny.github.io/vote.now/
          </a>`);
};

App.prototype.getVotes = async function getVotes(id) {
  return {
    votes: await this.db.get(id),
    prefix: HEX_PREFIX,
    complexity: COMPLEXITY
  };
};

const VOTE = Joi.object().keys({
  nonce: Joi.string().hex().required()
});

App.prototype.vote = async function vote(id, data) {
  const { error, value } = Joi.validate(data, VOTE);
  if (error)
    return { error: error.toString() };

  const nonce = Buffer.from(value.nonce, 'hex');
  if (!this.verifier.check(nonce))
    return { error: 'Invalid nonce' };

  return { votes: await this.db.increment(id) };
};

const app = new App();

module.exports = app.dispatch();
