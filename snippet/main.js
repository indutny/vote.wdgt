'use strict';
/* global document window XMLHttpRequest Blob localStorage Worker */

const WORKER_SOURCE =
    require('raw-loader!uglify-loader?' +
            '{"compress":{"unsafe":true,"unsafe_math":true,"evaluate":true,' +
            '"unused":true,"passes":3},"comments":false}' +
            '!../dist/snippet-worker.js');

const API_URL = 'https://vote.wdgt.io/api/v1';
const STORAGE_PREFIX = 'votenow/v1/';

function api(path, body, callback) {
  const req = new XMLHttpRequest();

  if (typeof body !== 'function') {
    req.open('PUT', API_URL + path, true);

    body = JSON.stringify(body);
    req.setRequestHeader('content-type', 'application/json');
  } else {
    req.open('GET', API_URL + path, true);

    callback = body;
    body = false;
  }

  req.onreadystatechange = () => {
    if (req.readyState !== XMLHttpRequest.DONE)
      return;

    let json;
    try {
      json = JSON.parse(req.responseText);
    } catch (e) {
      return callback(e);
    }

    const err = (req.status < 200 || req.status >= 400) ?
      new Error('Bad HTTP status: ' + req.status) : null;
    callback(err, json);
  };

  if (body)
    req.send(body);
  else
    req.send();
}

function Snippet(id) {
  if (!(this instanceof Snippet))
    return new Snippet(id);

  const state = {
    elem: typeof id === 'string' ? document.getElementById(id) : id,
    uri: 'https://' + document.location.host + document.location.pathname +
         document.location.search,
    id: null,
    worker: null,
    voted: false,
    ready: false,
    params: null
  };
  this._state = state;

  state.id = state.elem.dataset.voteId;

  const data = new Blob([ WORKER_SOURCE ], { type: 'text/javascript' });

  state.worker = new Worker(window.URL.createObjectURL(data));
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

  state.elem.onclick = (e) => {
    e.preventDefault();
    this._vote();
  };
}
module.exports = Snippet;

Snippet.prototype._init = function _init() {
  const state = this._state;

  // Compute id asynchronously
  if (!state.id) {
    state.worker.postMessage({ type: 'id', payload: state.uri });
    return;
  }

  state.elem.classList.add('votenow');

  state.elem.disabled = true;
  state.elem.classList.add('votenow-loading');

  // Load votes
  api('/vote/' + encodeURIComponent(state.id), (err, json) => {
    state.elem.classList.remove('votenow-loading');

    if (err)
      return this._error(err);

    if (json.error)
      return this._error(json.error);

    state.params = { complexity: json.complexity, prefix: json.prefix };
    state.elem.textContent = json.votes;

    state.elem.classList.add('votenow-ready');
    if (!state.voted)
      state.elem.disabled = false;

    state.ready = true;
  });

  // Check if we voted already
  if (typeof localStorage !== 'undefined' &&
      localStorage.getItem(STORAGE_PREFIX + state.id)) {
    state.voted = true;
    state.elem.disabled = true;
    state.elem.classList.add('votenow-voted');
  }
};

Snippet.prototype._vote = function _vote() {
  const state = this._state;
  if (state.voted || !state.ready)
    return;
  state.voted = true;
  state.elem.disabled = true;

  state.elem.classList.add('votenow-computing');
  state.elem.textContent = (state.elem.textContent >>> 0) + 1;
  state.worker.postMessage({ type: 'nonce', payload: state.params });
};

Snippet.prototype._onID = function _onID(id) {
  this._state.id = id;
  this._init();
};

Snippet.prototype._onNonce = function _onNonce(nonce) {
  const state = this._state;

  state.elem.classList.remove('votenow-computing');
  state.elem.classList.add('votenow-voting');

  api('/vote/' + encodeURIComponent(state.id), { nonce }, (err, json) => {
    state.elem.classList.remove('votenow-voting');
    if (err)
      return this._error(err);

    state.elem.classList.add('votenow-voted');
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_PREFIX + state.id, true);

    if (json.error)
      return this._error(json.error);
    else
      state.elem.textContent = json.votes;
  });
};

Snippet.prototype._error = function _error(err) {
  const state = this._state;

  state.elem.classList.add('votenow-error');
  /* eslint-disable no-console */
  if (typeof console === 'object' && console.error)
    console.error(err);
  /* eslint-enable no-console */
};

// Expose
if (typeof window !== 'undefined')
  window.VoteNow = Snippet;

if (typeof document !== 'undefined') {
  const elems = document.querySelectorAll('.votenow');
  Array.prototype.slice.call(elems).forEach(elem => new Snippet(elem));
}
