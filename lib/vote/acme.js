'use strict';

const fs = require('fs');
const path = require('path');
const debug = require('debug')('vote:acme');

const async = require('async');
const send = require('micro').send;

const ACME_SUBDIR = path.join('.well-known', 'acme-challenge');

function ACME(options) {
  this.root = options.root || process.env.ACME_ROOT;

  if (!this.root)
    return;

  this.files = new Map();
  this._refreshing = false;

  this.watcher = fs.watch(this.root, {
    persistent: false,
    recursive: true
  }, () => {
    this.refresh();
  });

  this.refresh();
}
module.exports = ACME;

ACME.prototype.serve = function serve(req, res, id) {
  if (!this.root)
    return send(res, 404, { error: 'no ACME enabled' });

  if (this._refreshing) {
    this._refreshing.push(() => this.serve(req, res, id));
    return;
  }

  if (!this.files.has(id))
    return send(res, 404, { error: 'no ACME challenge found' });

  // Send content!
  res.end(this.files.get(id));
};

ACME.prototype.refresh = function refresh() {
  if (this._refreshing) {
    this._refreshing.push(() => this.refresh());
    return;
  }

  debug('starting refresh');

  const queue = [];
  this._refreshing = queue;

  const subdir = path.join(this.root, ACME_SUBDIR);

  this.files = new Map();

  const onContent = (files) => {
    files.forEach((item) => {
      this.files.set(item.file, item.content);
    });

    this._refreshing = false;
    for (let i = 0; i < queue.length; i++)
      queue[i]();
  };

  fs.readdir(subdir, (err, files) => {
    // What can we do?
    if (err) {
      debug(err);
      return onContent([]);
    }

    async.map(files, (file, callback) => {
      fs.readFile(path.join(subdir, file), (err, content) => {
        if (err)
          return callback(err);

        callback(null, { file, content });
      });
    }, (err, files) => {
      // What can we do?! :)
      if (err) {
        debug(err);
        return onContent([]);
      }

      onContent(files);
    });
  });
};
