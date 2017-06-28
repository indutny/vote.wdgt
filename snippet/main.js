'use strict';
/* global document window */

const Base = require('./base');
const inherits = require('inherits');

function Widget(id) {
  if (!(this instanceof Widget))
    return new Widget(id);

  const elem = typeof id === 'string' ? document.getElementById(id) : id;
  elem.classList.add('votewdgt');

  this.elem = elem;
  this._lastState = null;

  Base.call(this, elem.dataset.voteId);

  this.elem.onclick = (e) => {
    e.preventDefault();
    this.vote();
  };
  this.elem.disabled = true;
}
inherits(Widget, Base);
module.exports = Widget;

Widget.Base = Base;

Widget.prototype.onStateChange = function onStateChange(state, payload) {
  const elem = this.elem;

  if (this._lastState && this._lastState !== 'ready')
    elem.classList.remove('votewdgt-' + this._lastState);
  elem.classList.add('votewdgt-' + state);
  this._lastState = state;

  if (state === 'ready') {
    this.elem.textContent = payload.votes;
    this.elem.disabled = payload.voted;
  } else if (state === 'computing' || state === 'voted') {
    this.elem.textContent = payload.votes;
    this.elem.disabled = true;
  } else if (state === 'error') {
    /* eslint-disable no-console */
    if (typeof console === 'object' && console.error)
      console.error(payload);
    /* eslint-enable no-console */
  }
};

// Expose
window.VoteWidget = Widget;

const elems = document.querySelectorAll('.votewdgt');
Array.prototype.slice.call(elems).forEach(elem => new Widget(elem));
