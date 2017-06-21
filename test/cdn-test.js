'use strict';

const zlib = require('zlib');
const brotli = require('brotli');
const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');

const CONFIG = require('../config.json');

const vote = require('../');
const app = new vote.App(Object.assign({
  db: new vote.MemoryDB()
}, CONFIG)).dispatch();

test('404', async (t) => {
  const url = await listen(micro(app));
  const err = await t.throws(request(url + '/cdn/not-found.js'));

  t.is(err.statusCode, 404, '404');
});

test('file redirect', async (t) => {
  const url = await listen(micro(app));

  const err = await t.throws(request(url + '/cdn/snippet.js', {
    followRedirect: false
  }));
  t.is(err.statusCode, 302, 'status code');
  t.regex(err.response.headers.location, /^\/cdn\/[a-f0-9]{64}\/snippet.js$/,
    'location header');
});

test('GET', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/cdn/snippet.js');

  t.is(typeof body, 'string', 'should give string body');
  t.truthy(body.length > 0, 'should give non-empty body');
});

test('HEAD', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/cdn/snippet.js', {
    method: 'HEAD'
  });

  t.is(body['content-type'], 'application/javascript;charset=utf-8',
    'proper content-type');
  t.is(body['cache-control'], 'public, max-age=31536000',
    'cache-control');
  t.is(typeof body['etag'], 'string',
    'etag');
});

test('GET deflate', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/cdn/snippet.js', {
    method: 'GET',
    encoding: null,
    headers: {
      'accept-encoding': 'deflate'
    }
  });

  t.notThrows(() => {
    zlib.inflateSync(body);
  });
});

test('GET gzip', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/cdn/snippet.js', {
    method: 'GET',
    encoding: null,
    headers: {
      'accept-encoding': 'gzip'
    }
  });

  t.notThrows(() => {
    zlib.gunzipSync(body);
  });
});

test('GET brotli', async (t) => {
  const url = await listen(micro(app));
  const body = await request(url + '/cdn/snippet.js', {
    method: 'GET',
    encoding: null,
    headers: {
      'accept-encoding': 'br'
    }
  });

  t.notThrows(() => {
    brotli.decompress(body);
  });
});
