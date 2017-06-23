'use strict';

const { send, buffer } = require('micro');
const debug = require('debug')('vote:github');
const crypto = require('crypto');
const childProcess = require('child_process');
const Buffer = require('buffer').Buffer;
const compareVersions = require('compare-versions');

const CURRENT_VERSION = require('package')(module).version;

const SIGNATURE_RE = /^(sha(?:1|256))=((?:[a-fA-F0-9]{2})+)$/;
const BODY_SIZE_LIMIT = 100 * 1024;

function GitHub(options) {
  this.script = options.script;
  this.secret = options.secret;

  this.running = false;
  this.pending = false;
}
module.exports = GitHub;

GitHub.prototype.serve = async function serve(req, res) {
  if (!this.script || !this.secret)
    return send(res, 404, { error: 'No GitHub hooks are configured' });

  if (req.headers['x-github-event'] !== 'create')
    return send(res, 400, { error: 'Invalid x-github-event header' });

  if (!req.headers['x-hub-signature'])
    return send(res, 400, { error: 'Missing x-hub-signature header' });

  const signature = req.headers['x-hub-signature'].match(SIGNATURE_RE);
  if (!signature)
    return send(res, 400, { error: 'Invalid signature format' });

  const body = await buffer(req, { limit: BODY_SIZE_LIMIT });
  const expected =
    crypto.createHmac(signature[1], this.secret).update(body).digest();
  const actual = Buffer.from(signature[2], 'hex');

  if (actual.length !== expected.length)
    return send(res, 400, { error: 'Invalid signature length' });

  if (!crypto.timingSafeEqual(actual, expected))
    return send(res, 400, { error: 'Invalid signature' });

  let type;
  let ref;
  try {
    const json = JSON.parse(body.toString());

    type = json.ref_type;
    ref = json.ref;
  } catch (e) {
    debug('invalid json err=%s', e);
    return send(res, 400, { error: 'Invalid JSON' });
  }

  if (type !== 'tag')
    return { ok: true };

  if (typeof ref !== 'string')
    return send(res, 400, { error: 'Invalid tag name' });

  this.exec(ref);
  return { ok: true };
};

GitHub.prototype.exec = function exec(tag) {
  if (compareVersions(tag, CURRENT_VERSION) <= 0) {
    debug(`can't update from ${CURRENT_VERSION} to ${tag}`);
    return;
  }

  if (this.running) {
    debug(`pending release for tag "${tag}"`);
    this.pending = tag;
    return;
  }
  this.running = true;

  debug(`executing "${this.script}" for tag "${tag}"`);
  childProcess.execFile(this.script, [ tag ] , (err) => {
    this.running = false;
    if (this.pending !== false) {
      const tag = this.pending;
      this.pending = false;
      this.exec(tag);
    }

    if (err)
      return debug('error err=%s', err);

    debug('success');
  });
};
