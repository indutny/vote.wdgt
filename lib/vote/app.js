'use strict';

const Buffer = require('buffer').Buffer;

const { send, json } = require('micro');
const microDispatch = require('micro-route/dispatch');
const pow = require('proof-of-work');
const Joi = require('joi');

const vote = require('../vote');

const MAX_ID_LENGTH = 64;
const BODY_SIZE_LIMIT = 1024;
const VERSION = require('package')(module).version;

function App(config) {
  this.config = config;

  const prefix = Buffer.from(config.prefix, 'hex');
  this.hexPrefix = prefix.toString('hex');

  this.verifier = new pow.Verifier({
    // Probability = 1e-11
    size: 64 * 1024 * 1024,
    n: 37,

    complexity: this.config.complexity,
    prefix: prefix,
    validity: this.config.validity
  });

  setInterval(() => {
    this.verifier.reset();
  }, this.config.validity * 2);

  this.db = typeof this.config.db === 'object' ? this.config.db :
    new vote.DB(this.config.db);
  this.cdn = new vote.CDN();
  this.acme = new vote.ACME(this.config.acme || {});
  this.github = new vote.GitHub(this.config.github || {});
}
module.exports = App;

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
        version: VERSION,
        prefix: this.hexPrefix,
        complexity: this.config.complexity,
        endpoints: {
          '/api/v1/': { method: 'GET' },
          '/api/v1/vote/:id': [
            { method: 'GET' },
            { method: 'PUT', body: { nonce: 'hex' } }
          ]
        }
      };
    })
    .dispatch('/api/v1/vote/:id', 'GET', (req, res, { params }) => {
      this.setCORSHeaders(res);
      if (params.id.length > MAX_ID_LENGTH)
        return send(res, 400, { error: 'ID overflow' });

      return this.getVotes(params.id);
    })
    .dispatch('/api/v1/vote/:id', 'PUT', async (req, res, { params }) => {
      this.setCORSHeaders(res);
      if (params.id.length > MAX_ID_LENGTH)
        return send(res, 400, { error: 'ID overflow' });

      let body;
      try {
        body = await json(req, { limit: BODY_SIZE_LIMIT });
      } catch (e) {
        return send(res, 400, { error: 'Invalid JSON' });
      }

      return this.vote(res, params.id, body);
    })
    .dispatch('/api/v1/github/deploy', 'POST', (req, res) => {
      return this.github.serve(req, res);
    })
    .dispatch('/cdn/*', 'GET', (req, res) => this.cdn.serve(req, res))
    .dispatch('/cdn/*', 'HEAD', (req, res) => this.cdn.serve(req, res))
    .dispatch(
      '/.well-known/acme-challenge/:code',
      'GET',
      (req, res, { params }) => {
        this.acme.serve(req, res, params.code);
      }
    )
    .otherwise((req, res) => {
      send(res, 404, { error: 'Invalid endpoint' });
    });
};

App.prototype.serveCORS = function serveCORS(req, res) {
  this.setCORSHeaders(res);
  res.writeHead(200, {
    'content-length': 0
  });
  res.end();
};

App.prototype.serveHome = function serveHome(req, res) {
  const TARGET = 'https://indutny.github.io/vote.wdgt/';
  res.writeHead(302, {
    location: TARGET,
    'cache-control': 'public, max-age=3600',
    'content-type': 'text/html'
  });
  res.end(`Redirecting to <a href="${TARGET}">${TARGET}</a>`);
};

App.prototype.getVotes = async function getVotes(id) {
  let votes;

  try {
    votes = await this.db.get(id);
  } catch (e) {
    return { error: 'DB error' };
  }

  return {
    votes,
    prefix: this.hexPrefix,
    complexity: votes === 0 ?
      this.config.initialComplexity :
      this.config.complexity
  };
};

const VOTE = Joi.object().keys({
  nonce: Joi.string().hex().required()
});

App.prototype.vote = async function vote(res, id, data) {
  const { error, value } = Joi.validate(data, VOTE);
  if (error)
    return send(res, 400, { error: error.toString() });

  let votes = await this.db.get(id);

  // Higher complexity for initial vote
  let complexity = votes === 0 ? this.config.initialComplexity : null;

  const nonce = Buffer.from(value.nonce, 'hex');
  if (!this.verifier.check(nonce, complexity))
    return send(res, 400, { error: 'Invalid nonce' });

  try {
    votes = await this.db.increment(id);
  } catch (e) {
    return send(res, 500, { error: 'DB error' });
  }

  return { votes };
};
