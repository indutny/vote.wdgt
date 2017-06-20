'use strict';
/* global postMessage */

const sha256 = require('hash.js/lib/hash/sha/256');
const Solver = require('proof-of-work/lib/pow/solver');

const solver = new Solver();

function fromHEXDigit(char) {
  if (0x61 <= char && char <= 0x66)
    return char - 0x61 + 10;
  if (0x41 <= char && char <= 0x46)
    return char - 0x41 + 10;
  if (0x30 <= char && char <= 0x39)
    return char - 0x30;
  return 0;
}

function fromHEX(str) {
  const res = [];
  for (let i = 0; i < str.length; i += 2) {
    const l = str.charCodeAt(i);
    const r = str.charCodeAt(i + 1);

    res.push((fromHEXDigit(l) << 4) | fromHEXDigit(r));
  }
  return res;
}

function toHEXDigit(num) {
  if (num < 10)
    return String.fromCharCode(0x30 + num);
  else
    return String.fromCharCode(0x61 + num - 10);
}

function toHEX(buf) {
  let res = '';
  for (let i = 0; i < buf.length; i++) {
    const cur = buf[i];
    const l = (cur >> 4) & 0xf;
    const r = cur & 0xf;

    res += toHEXDigit(l) + toHEXDigit(r);
  }
  return res;
}

/* eslint-disable no-unused-vars, no-undef */
onmessage = (e) => {
  const msg = e.data;
  const type = msg.type;
  const payload = msg.payload;

  if (type === 'id') {
    postMessage({
      type: 'id',
      payload: sha256().update(payload).digest('hex')
    });
  } else if (type === 'nonce') {
    const nonce = solver.solve(payload.complexity, fromHEX(payload.prefix));
    postMessage({
      type: 'nonce',
      payload: toHEX(nonce)
    });
  }
};
/* eslint-enable no-unused-vars, no-undef */
