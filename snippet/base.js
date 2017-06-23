'use strict';
/* global document window Blob localStorage Worker */

const api = require('./api');

const WORKER_SOURCE =
    require('raw-loader!uglify-loader?' +
            '{"compress":{"unsafe":true,"unsafe_math":true,"evaluate":true,' +
            '"unused":true,"passes":3},"comments":false}' +
            '!../dist/snippet-worker.js');
const WORKER_BLOB = new Blob([ WORKER_SOURCE ], { type: 'text/javascript' });

const STORAGE_PREFIX = 'votewdgt/v1/';

function Base(id) {
  const state = {
    uri: 'https://' + document.location.host + document.location.pathname +
         document.location.search,
    id: id || null,
    worker: null,
    voted: false,
    votes: -1,
    ready: false,
    params: null,
    callback: null
  };
  this._state = state;

  state.worker = new Worker(window.URL.createObjectURL(WORKER_BLOB));
  state.worker.onmessage = (e) => {
    const msg = e.data;
    const type = msg.type;
    const payload = msg.payload;

    if (type === 'id')
      this._onID(payload);
    else if (type === 'nonce')
      this._onNonce(payload);
  };

  this._init();
}
module.exports = Base;

// Public API

Base.prototype.vote = function vote(callback) {
  callback = callback || (() => {});

  const state = this._state;

  if (state.voted)
    return callback(new Error('Already voted'));
  state.voted = true;
  state.callback = callback;

  // Vote later
  if (!state.ready)
    return;

  this.onStateChange('computing', { votes: state.votes + 1 });
  state.worker.postMessage({ type: 'nonce', payload: state.params });
};

Base.prototype.onStateChange = function onStageChange() {
  // Overridable method.
  // Two arguments are passed: `state` and `payload`.
  // Payload is present only for: `loading`, `ready`, `computing`, `voted`,
  // `error` states
};

// Private

Base.prototype._init = function _init() {
  const state = this._state;

  this.onStateChange('init');

  // Compute id asynchronously
  if (!state.id) {
    state.worker.postMessage({ type: 'id', payload: state.uri });
    return;
  }

  this.onStateChange('loading', state.id);

  // Check if we voted already
  if (typeof localStorage !== 'undefined' &&
      localStorage.getItem(STORAGE_PREFIX + state.id)) {
    state.voted = true;
  }

  // Load votes
  api('/vote/' + encodeURIComponent(state.id), (err, json) => {
    if (err)
      return this.onStateChange('error', err);

    if (json.error)
      return this.onStateChange('error', json.error);

    state.params = { complexity: json.complexity, prefix: json.prefix };
    state.votes = json.votes;
    state.ready = true;

    this.onStateChange('ready', {
      complexity: json.complexity,
      prefix: json.prefix,
      voted: state.voted,
      votes: json.votes
    });

    // Pending vote
    if (state.callback)
      this.vote(state.callback);
  });
};

// Worker message handlers

Base.prototype._onID = function _onId(id) {
  this._state.id = id;
  this._init();
};

Base.prototype._onNonce = function _onNonce(nonce) {
  const state = this._state;

  this.onStateChange('voting');

  api('/vote/' + encodeURIComponent(state.id), { nonce }, (err, json) => {
    if (err) {
      this.onStateChange('error', err);
      return state.callback(err);
    }

    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_PREFIX + state.id, true);

    if (json.error) {
      this.onStateChange('error', json.error);
      return state.callback(json.error);
    }
    this.onStateChange('voted', json);
    state.callback(null, json);
  });
};
