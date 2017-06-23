'use strict';
/* eslint-disable no-empty */

const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');

const vote = require('../');
const CONFIG = require('../config.json');

const TMP_DIR = path.join(__dirname, 'tmp');

function app() {
  return new vote.App(Object.assign({
    acme: { root: TMP_DIR },
    db: new vote.MemoryDB()
  }, CONFIG)).dispatch();
}

test.before(() => {
  try {
    rimraf.sync(TMP_DIR);
  } catch (e) {
  }
  mkdirp.sync(path.join(TMP_DIR, '.well-known', 'acme-challenge'));
});

test.after(() => {
  try {
    rimraf.sync(TMP_DIR);
  } catch (e) {
  }
});

test('GET challenge', async (t) => {
  fs.writeFileSync(path.join(TMP_DIR, '.well-known', 'acme-challenge', '1'),
    'hello');

  const url = await listen(micro(app()));
  const body = await request(url + '/.well-known/acme-challenge/1');

  t.is(body, 'hello');
});

test('unknown challenge', async (t) => {
  const url = await listen(micro(app()));
  const err = await t.throws(request(url + '/.well-known/acme-challenge/2'));
  t.is(err.statusCode, 404, '404');
});
