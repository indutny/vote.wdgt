'use strict';

const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');
const pow = require('proof-of-work');
const Buffer = require('buffer').Buffer;

const CONFIG = require('../config.json');

const vote = require('../');
const app = new vote.App(Object.assign({
  db: new vote.MemoryDB()
}, CONFIG)).dispatch();

const VERSION = require('package')(module).version;
const HOME_HASH =
    '252e170cd2962f6ed0f29dc745f712fd9307d75ad59306337e91c90b3a049cdf';

test('homepage redirect', async (t) => {
  const url = await listen(micro(app));

  const err = await t.throws(request(url, { followRedirect: false }));
  t.is(err.statusCode, 302, 'status code');
  t.is(err.response.headers.location, 'https://indutny.github.io/vote.wdgt/',
    'location header');
});

test('/api/v1/', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/api/v1/', { json: true });

  t.is(body.prefix, CONFIG.prefix, 'correct prefix');
  t.is(body.complexity, CONFIG.complexity, 'correct complexity');
  t.is(body.version, VERSION, 'correct version');
  t.deepEqual(body.endpoints, {
    '/api/v1/': { method: 'GET' },
    '/api/v1/vote/:id': [
      { method: 'GET' },
      { method: 'PUT', body: { nonce: 'hex' } }
    ]
  }, 'correct endpoints');
});

test('/invalid/endpoint/', async (t) => {
  const url = await listen(micro(app));
  const err = await t.throws(request(url + '/invalid/endpoint'));

  t.is(err.statusCode, 404);
});

test('/api/v1/vote/:id', async (t) => {
  const url = await listen(micro(app)) + '/api/v1/vote/' + HOME_HASH;

  // Too long ID
  {
    const err = await t.throws(request(url + new Array(5).join(HOME_HASH), {
      json: true
    }));

    t.is(err.statusCode, 400);
    t.deepEqual(err.response.body, { error: 'ID overflow' }, 'ID overflow');
  }

  // Normal GET
  {
    const body = await request(url, { json: true });

    t.deepEqual(body, {
      prefix: CONFIG.prefix,
      complexity: CONFIG.initialComplexity,
      votes: 0
    }, 'correct GET response');
  }

  // Invalid JSON
  {
    const err = await t.throws(request(url, {
      method: 'PUT',
      json: true
    }));

    t.is(err.statusCode, 400);
    t.deepEqual(err.response.body, { error: 'Invalid JSON' }, 'invalid JSON');
  }

  // Too long ID
  {
    const err = await t.throws(request(url + new Array(5).join(HOME_HASH), {
      method: 'PUT',
      json: true,
      body: {}
    }));

    t.is(err.statusCode, 400);
    t.deepEqual(err.response.body, { error: 'ID overflow' }, 'ID overflow');
  }

  // No nonce
  {
    const err = await t.throws(request(url, {
      method: 'PUT',
      json: true,
      body: {}
    }));

    t.is(err.statusCode, 400);
    t.regex(err.response.body.error, /ValidationError/);
  }

  // Invalid nonce
  {
    const err = await t.throws(request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: 'not-hex'
      }
    }));

    t.is(err.statusCode, 400);
    t.regex(err.response.body.error, /ValidationError/);
  }

  // Incorrect nonce
  {
    const err = await t.throws(request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: 'abcd'
      }
    }));

    t.is(err.statusCode, 400);
    t.deepEqual(err.response.body, { error: 'Invalid nonce' });
  }

  let dup;
  // Correct nonce
  {
    const solver = new pow.Solver();

    const nonce = solver.solve(
      CONFIG.initialComplexity,
      Buffer.from(CONFIG.prefix, 'hex'));

    const body = await request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: nonce.toString('hex')
      }
    });

    t.deepEqual(body, { votes: 1 });

    dup = nonce;
  }

  // Duplicate nonce
  {
    const err = await t.throws(request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: dup.toString('hex')
      }
    }));

    t.is(err.statusCode, 400);
    t.deepEqual(err.response.body, { error: 'Invalid nonce' });
  }

  // Fetch update
  {
    const body = await request(url, { json: true });

    t.deepEqual(body, {
      prefix: CONFIG.prefix,
      complexity: CONFIG.complexity,
      votes: 1
    }, 'correct GET response');
  }
});

test('/api/v1/vote/:id buffer OOB', async (t) => {
  const url = await listen(micro(app)) + '/api/v1/vote/' + HOME_HASH;
  const big = new Array(1000).join('xxx');

  const err = await t.throws(request(url, {
    method: 'PUT',
    json: true,
    body: big
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Invalid JSON' });
});
