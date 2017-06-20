'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const FILES = new Map();
const DIST = path.join(__dirname, '..', '..', 'dist');

[
  { uri: '/cdn/snippet.js', file: path.join(DIST, 'snippet.js') }
].forEach(({ uri, file }) => {
  const content = fs.readFileSync(file);
  const ext = path.extname(file);

  const mime = ext === '.js' ? 'application/javascript;charset=utf-8' :
    'text/plain';

  FILES.set(uri, {
    mime,
    content
  });
});

function Cloudfront(config) {
  this.token =
      Buffer.from(config && config.token || process.env.CLOUDFRONT_TOKEN || '');

  this.files = new Map();
}
module.exports = Cloudfront;

Cloudfront.prototype._checkToken = function _checkToken(req) {
  if (this.token.length === 0)
    return true;

  const actual = Buffer.from(req.headers['x-cloudfront-token'] || '');

  // This leaks length, but we don't care
  if (actual.length !== this.token.length)
    return false;

  return crypto.timingSafeEqual(actual, this.token);
};

Cloudfront.prototype.serve = function serve(req, res) {
  if (!this._checkToken(req))
    return { error: 'Invalid token' };

  if (!FILES.has(req.url)) {
    res.writeHead(404);
    res.end();
    return;
  }

  const file = FILES.get(req.url);
  res.writeHead(200, {
    'content-type': file.mime,
    'content-length': file.content.length
  });
  if (req.method === 'GET')
    res.end(file.content);
  else
    res.end();
};
