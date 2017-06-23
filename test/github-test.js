'use strict';
/* eslint-disable no-empty */

const crypto = require('crypto');

const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');

const vote = require('../');
const CONFIG = require('../config.json');

const SECRET = 'secret';

function app(disable) {
  return new vote.App(Object.assign({
    github: !disable && {
      script: 'echo ok',
      secret: SECRET
    },
    db: new vote.MemoryDB()
  }, CONFIG)).dispatch();
}

function sign(body) {
  return 'sha1=' + crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}

test('POST without config', async (t) => {
  const url = await listen(micro(app(true)));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    body: {}
  }));

  t.is(err.statusCode, 404);
  t.deepEqual(err.response.body, { error: 'No GitHub hooks are configured' });
});

test('POST with invalid event type', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    headers: {
      'x-github-event': 'push',
      'x-hub-signature': 'ohai'
    },
    body: {}
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Invalid x-github-event header' });
});

test('POST without signature', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    body: {},
    headers: {
      'x-github-event': 'release'
    }
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Missing x-hub-signature header' });
});

test('POST with unparseable signature', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    headers: {
      'x-github-event': 'release',
      'x-hub-signature': 'ohai'
    },
    body: {}
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Invalid signature format' });
});

test('POST with invalid signature length', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    headers: {
      'x-github-event': 'release',
      'x-hub-signature': 'sha1=abcd'
    },
    body: {}
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Invalid signature length' });
});

test('POST with invalid signature', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    headers: {
      'x-github-event': 'release',
      'x-hub-signature': 'sha1=' +
        crypto.createHash('sha1').update('').digest('hex')
    },
    body: {}
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(err.response.body, { error: 'Invalid signature' });
});

test('POST with valid signature', async (t) => {
  const post = {
    release: { tag_name: 'v1.0.0' }
  };

  const url = await listen(micro(app()));
  const body = await request(url + '/api/v1/github/deploy', {
    method: 'POST',
    json: true,
    headers: {
      'x-github-event': 'release',
      'x-hub-signature': sign(JSON.stringify(post))
    },
    body: post
  });

  t.deepEqual(body, { ok: true });
});

test('POST with invalid JSON', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/api/v1/github/deploy', {
    method: 'POST',
    headers: {
      'x-github-event': 'release',
      'x-hub-signature': sign('1-1')
    },
    body: '1-1'
  }));

  t.is(err.statusCode, 400);
  t.deepEqual(JSON.parse(err.response.body), { error: 'Invalid JSON' });
});
