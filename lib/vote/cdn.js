'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const brotli = require('brotli');
const Buffer = require('buffer').Buffer;

const REDIRECTS = new Map();
const FILES = new Map();
const DIST = path.join(__dirname, '..', '..', 'dist');

const GZIP_RE = /(^|\W)gzip(\W|$)/;
const DEFLATE_RE = /(^|\W)deflate(\W|$)/;
const BROTLI_RE = /(^|\W)br(\W|$)/;

[
  { uri: '/snippet.js', file: path.join(DIST, 'snippet.js') },
  { uri: '/snippet-v2.js', file: path.join(DIST, 'snippet-v2.js') }
].forEach(({ uri, file }) => {
  const ext = path.extname(file);
  const content = fs.readFileSync(file);
  const compression = {
    none: content,
    deflate: zlib.deflateSync(content, { level: 9 }),
    gzip: zlib.gzipSync(content, { level: 9 }),
    brotli: Buffer.from(brotli.compress(content, { mode: 1, quality: 11 }))
  };

  const mime = ext === '.js' ? 'application/javascript;charset=utf-8' :
    'text/plain';

  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const fullURI = '/cdn/' + hash + uri;

  REDIRECTS.set('/cdn' + uri, {
    uri: fullURI,
    etag: hash
  });
  FILES.set(fullURI, {
    mime,
    hash,
    compression
  });
});

function CDN() {
}
module.exports = CDN;

CDN.prototype.redirect = function redirect(req, res) {
  const redirect = REDIRECTS.get(req.url);

  res.writeHead(302, {
    'cache-control': 'public, max-age=3600',
    etag: redirect.etag,
    location: redirect.uri
  });
  res.end();
};

CDN.prototype.serve = function serve(req, res) {
  if (REDIRECTS.has(req.url))
    return this.redirect(req, res);

  if (!FILES.has(req.url)) {
    res.writeHead(404);
    res.end();
    return;
  }

  const file = FILES.get(req.url);

  let content;
  const accept = req.headers['accept-encoding'];
  if (accept && BROTLI_RE.test(accept)) {
    res.setHeader('content-encoding', 'br');
    content = file.compression.brotli;
  } else if (accept && DEFLATE_RE.test(accept)) {
    res.setHeader('content-encoding', 'deflate');
    content = file.compression.deflate;
  } else if (accept && GZIP_RE.test(accept)) {
    res.setHeader('content-encoding', 'gzip');
    content = file.compression.gzip;
  } else {
    content = file.compression.none;
  }

  res.writeHead(200, {
    'content-type': file.mime,
    'content-length': content.length,
    'cache-control': 'public, max-age=31536000, immutable',
    'etag': file.hash
  });

  if (req.method === 'GET')
    res.end(content);
  else
    res.end();
};
