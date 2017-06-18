'use strict';

const hash = require('hash.js');

const WORKER_SOURCE = require('raw-loader!../dist/snippet-worker.js');

const API_URL = 'https://vote.now.sh/api/v1';
const STORAGE_PREFIX = 'votenow/v1/';

function Snippet(id) {
  if (!(this instanceof Snippet))
    return new Snippet(id);

  this._elem = typeof id === 'string' ?
      document.getElementById(id) :
      id;
  this._id = this._elem.dataset.voteId ||
             hash.sha256().update(document.location.href.replace(/#.*$/, ''))
                          .digest('hex');

  const data = new Blob([ WORKER_SOURCE ], { type: 'text/javascript' });

  if (typeof Worker !== 'undefined') {
    this._worker = new Worker(window.URL.createObjectURL(data));
    this._worker.onmessage = e => this._onNonce(e.data);
  }

  this._voted = false;
  this._ready = false;
  this._params = null;
  this._init();

  this._elem.onclick = (e) => {
    e.preventDefault();
    this._vote();
  };
}
module.exports = Snippet;

Snippet.prototype._init = function _init() {
  this._elem.classList.add('votenow');
  this._elem.disabled = true;
  this._elem.classList.add('votenow-loading');

  let waiting = 2;
  const ready = () => {
    if (--waiting !== 0)
      return;

    this._elem.classList.remove('votenow-loading');
    this._elem.classList.add('votenow-ready');
    this._elem.disabled = false;

    this._ready = true;
  };

  // Load params
  fetch(API_URL + '/').then(res => res.json()).then((json) => {
    this._params = { complexity: json.complexity, prefix: json.prefix };
    ready();
  });

  // Load votes
  fetch(API_URL + '/vote/' + encodeURIComponent(this._id)).then((res) => {
    return res.json();
  }).then((json) => {
    this._elem.textContent = json.votes;
    ready();
  });

  // Check if we voted already
  if (typeof localStorage !== 'undefined' &&
      localStorage.getItem(STORAGE_PREFIX + this._id)) {
    this._voted = true;
    this._elem.disabled = true;
    this._elem.classList.add('votenow-voted');
  }
};

Snippet.prototype._vote = function _vote() {
  if (this._voted || !this._ready)
    return;
  this._voted = true;
  this._elem.disabled = true;

  this._elem.classList.add('votenow-computing');
  this._elem.textContent = (this._elem.textContent >>> 0) + 1;
  this._worker.postMessage(this._params);
};

Snippet.prototype._onNonce = function _onNonce(nonce) {
  this._elem.classList.remove('votenow-computing');
  this._elem.classList.add('votenow-voting');

  const uri = API_URL + '/vote/' + encodeURIComponent(this._id);
  fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nonce })
  }).then(res => res.json()).then((json) => {
    this._elem.classList.remove('votenow-voting');
    this._elem.classList.add('votenow-voted');
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_PREFIX + this._id, true);

    if (json.error)
      this._elem.classList.add('votenow-error');
    else
      this._elem.textContent = json.votes;
  });
};

// Expose
if (typeof window !== 'undefined')
  window.VoteNow = Snippet;

if (typeof document !== 'undefined')
  document.querySelectorAll('.votenow').forEach(elem => new Snippet(elem));
