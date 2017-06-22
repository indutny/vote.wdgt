'use strict';

const fs = require('fs');
const path = require('path');

const send = require('micro').send;

const ACME_SUBDIR = path.join('.well-known', 'acme-challenge');

function ACME(options) {
  this.root = options.root || process.env.ACME_ROOT;
  this.rescan = options.rescan || 3600000;
  this.last = 0;
}
module.exports = ACME;

ACME.prototype.serve = function serve(req, res, id) {
  if (!this.root)
    return send(res, 404, { error: 'no ACME enabled' });

  const now = Date.now();
  if (now - this.last < this.rescan)
    return send(res, 400, { error: 'too early to request new challenge' });

  this.last = now;

  const file = path.join(this.root, ACME_SUBDIR, id);

  function read() {
    fs.readFile(file, (err, data) => {
      if (err)
        return send(res, 500, { error: 'can\'t read ACME file' });

      // Just send raw bytes
      res.end(data);
    });
  }

  fs.exists(file, (exists) => {
    if (!exists)
      return send(res, 404, { error: 'no ACME challenge created' });

    read();
  });
};
