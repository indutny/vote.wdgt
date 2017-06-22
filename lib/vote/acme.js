'use strict';

const fs = require('fs');
const path = require('path');
const debug = require('debug')('vote:acme');

const async = require('async');
const chokidar = require('chokidar');
const send = require('micro').send;

const ACME_SUBDIR = path.join('.well-known', 'acme-challenge');

function ACME(options) {
  this.root = options.root || process.env.ACME_ROOT;

  if (!this.root)
    return;

  this.subdir = path.join(this.root, ACME_SUBDIR);

  this.files = new Map();
  this._refreshing = false;
  this._pendingRefresh = false;

  debug('creating watcher for %s', this.root);
  chokidar.watch(this.root, {
    ignoreInitial: true
  }).on('ready', () => {
    debug('watcher ready');
  }).on('add', () => {
    debug('watcher add');
    this.refresh();
  }).on('change', () => {
    debug('watcher change');
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

  if (!this.files.has(id)) {
    debug('challenge miss');
    return send(res, 404, { error: 'no ACME challenge found' });
  }

  // Send content!
  debug('serving response');
  res.end(this.files.get(id));
};

ACME.prototype.refresh = function refresh() {
  if (this._refreshing) {
    this._pendingRefresh = true;
    return;
  }

  debug('starting refresh');

  const queue = [];
  this._refreshing = queue;

  this.files = new Map();

  const onContent = (files) => {
    debug('adding files=%d', files.length);
    files.forEach((item) => {
      debug('add file %s', item.file);
      this.files.set(item.file, item.content);
    });

    this._refreshing = false;

    // Refresh before serving requests
    if (this._pendingRefresh) {
      this._pendingRefresh = false;
      this.refresh();
    }

    for (let i = 0; i < queue.length; i++)
      queue[i]();
  };

  fs.readdir(this.subdir, (err, files) => {
    // What can we do?
    if (err) {
      debug(err);
      return onContent([]);
    }

    async.map(files, (file, callback) => {
      fs.readFile(path.join(this.subdir, file), (err, content) => {
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
