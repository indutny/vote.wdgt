'use strict';

const { send, buffer } = require('micro');
const debug = require('debug')('vote:github');
const crypto = require('crypto');
const exec = require('child_process').exec;
const Buffer = require('buffer').Buffer;

const SIGNATURE_RE = /^(sha(?:1|256))=((?:[a-fA-F0-9]{2})+)$/;

function GitHub(options) {
  this.script = options.script;
  this.secret = options.secret;
}
module.exports = GitHub;

GitHub.prototype.serve = async function serve(req, res) {
  if (!this.script || !this.secret)
    return send(res, 404, { error: 'No GitHub hooks are configured' });

  if (!req.headers['x-hub-signature'])
    return send(res, 400, { error: 'Missing x-hub-signature header' });

  const signature = req.headers['x-hub-signature'].match(SIGNATURE_RE);
  if (!signature)
    return send(res, 400, { error: 'Invalid signature format' });

  const body = await buffer(req);
  const expected =
    crypto.createHmac(signature[1], this.secret).update(body).digest();
  const actual = Buffer.from(signature[2], 'hex');

  if (actual.length !== expected.length)
    return send(res, 400, { error: 'Invalid signature length' });

  if (!crypto.timingSafeEqual(actual, expected))
    return send(res, 400, { error: 'Invalid signature' });

  debug(`executing "${this.script}"`);
  exec(this.script, (err) => {
    if (err)
      return debug('error err=%s', err);

    debug('success');
  });

  return { ok: true };
};
