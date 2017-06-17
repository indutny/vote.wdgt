'use strict';

const Buffer = require('buffer').Buffer;
const pow = require('proof-of-work');

const solver = new pow.Solver();

onmessage = (e) => {
  const msg = e.data;

  const nonce = solver.solve(msg.complexity, Buffer.from(msg.prefix, 'hex'));
  postMessage(nonce.toString('hex'));
};
