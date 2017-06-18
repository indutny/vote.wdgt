'use strict';

const WORKER_SOURCE = require('raw-loader!../dist/snippet-worker.js');

const API_URL = 'https://vote.now.sh/api/v1';
const STORAGE_PREFIX = 'votenow/v1/';

function Snippet(id) {
  if (!(this instanceof Snippet))
    return new Snippet(id);

  const state = {
    elem: typeof id === 'string' ? document.getElementById(id) : id,
    uri: document.location.href.replace(/#.*$/, ''),
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

  const ready = () => {
    state.elem.classList.remove('votenow-loading');
    state.elem.classList.add('votenow-ready');
    if (!state.voted)
      state.elem.disabled = false;

    state.ready = true;
  };

  // Load votes
  fetch(API_URL + '/vote/' + encodeURIComponent(state.id)).then((res) => {
    return res.json();
  }).then((json) => {
    state.params = { complexity: json.complexity, prefix: json.prefix };
    state.elem.textContent = json.votes;
    ready();
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

  const uri = API_URL + '/vote/' + encodeURIComponent(state.id);
  fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nonce })
  }).then(res => res.json()).then((json) => {
    state.elem.classList.remove('votenow-voting');
    state.elem.classList.add('votenow-voted');
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_PREFIX + state.id, true);

    if (json.error)
      state.elem.classList.add('votenow-error');
    else
      state.elem.textContent = json.votes;
  });
};

// Expose
if (typeof window !== 'undefined')
  window.VoteNow = Snippet;

if (typeof document !== 'undefined')
  document.querySelectorAll('.votenow').forEach(elem => new Snippet(elem));
