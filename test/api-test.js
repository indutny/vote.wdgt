'use strict';

const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');
const pow = require('proof-of-work');
const Buffer = require('buffer').Buffer;

const CONFIG = require('../config.json');

process.env.CLOUDFRONT_TOKEN = 'token';

const vote = require('../');
const app = new vote.App(Object.assign({
  db: new vote.MemoryDB()
}, CONFIG)).dispatch();

const HOME_HASH =
    '252e170cd2962f6ed0f29dc745f712fd9307d75ad59306337e91c90b3a049cdf';

test('homepage redirect', async (t) => {
  const url = await listen(micro(app));

  const err = await t.throws(request(url, { followRedirect: false }));
  t.is(err.statusCode, 301, 'status code');
  t.is(err.response.headers.location, 'https://indutny.github.io/vote.now/',
    'location header');
});

test('/api/v1/', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/api/v1/', { json: true });

  t.is(body.prefix, CONFIG.prefix, 'correct prefix');
  t.is(body.complexity, CONFIG.complexity, 'correct complexity');
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
  const body = await request(url + '/invalid/endpoint', { json: true });

  t.deepEqual(body, { error: 'Invalid endpoint' });
});

test('/api/v1/vote/:id', async (t) => {
  const url = await listen(micro(app)) + '/api/v1/vote/' + HOME_HASH;

  // Too long ID
  {
    const body = await request(url + new Array(5).join(HOME_HASH), {
      json: true
    });

    t.deepEqual(body, { error: 'ID overflow' }, 'ID overflow');
  }

  // Normal GET
  {
    const body = await request(url, { json: true });

    t.deepEqual(body, {
      prefix: CONFIG.prefix,
      complexity: CONFIG.complexity,
      votes: 0
    }, 'correct GET response');
  }

  // Invalid JSON
  {
    const body = await request(url, {
      method: 'PUT',
      json: true
    });

    t.deepEqual(body, { error: 'Invalid JSON' }, 'invalid JSON');
  }

  // Too long ID
  {
    const body = await request(url + new Array(5).join(HOME_HASH), {
      method: 'PUT',
      json: true,
      body: {}
    });

    t.deepEqual(body, { error: 'ID overflow' }, 'ID overflow');
  }

  // No nonce
  {
    const body = await request(url, {
      method: 'PUT',
      json: true,
      body: {}
    });

    t.regex(body.error, /ValidationError/);
  }

  // Invalid nonce
  {
    const body = await request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: 'not-hex'
      }
    });

    t.regex(body.error, /ValidationError/);
  }

  // Incorrect nonce
  {
    const body = await request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: 'abcd'
      }
    });

    t.deepEqual(body, { error: 'Invalid nonce' });
  }

  let dup;
  // Correct nonce
  {
    const solver = new pow.Solver();

    const nonce = solver.solve(
      CONFIG.complexity,
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
    const body = await request(url, {
      method: 'PUT',
      json: true,
      body: {
        nonce: dup.toString('hex')
      }
    });

    t.deepEqual(body, { error: 'Invalid nonce' });
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

test('/cdn/*', async (t) => {
  const url = await listen(micro(app));
  const headers = {
    'x-cloudfront-token': process.env.CLOUDFRONT_TOKEN
  };

  {
    const body = await request(url + '/cdn/snippet.js', { json: true });

    t.deepEqual(body, { error: 'Invalid token' },
      'should not reply when token is invalid');
  }

  {
    const body = await request(url + '/cdn/snippet.js', {
      headers
    });

    t.is(typeof body, 'string', 'should give string body');
    t.truthy(body.length > 0, 'should give non-empty body');
  }

  {
    const body = await request(url + '/cdn/snippet.js', {
      method: 'HEAD',
      headers
    });

    t.is(body['content-type'], 'application/javascript;charset=utf-8');
  }

  {
    const err = await t.throws(request(url + '/cdn/not-found.js', {
      headers
    }));

    t.is(err.statusCode, 404, '404');
  }

  {
    const err = await t.throws(request(url + '/cdn/not-found.js', {
      headers
    }));

    t.is(err.statusCode, 404, '404');
  }
});
