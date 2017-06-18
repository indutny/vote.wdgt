'use strict';

const Buffer = require('buffer').Buffer;
const hash = require('hash.js');
const pow = require('proof-of-work');

const solver = new pow.Solver();

onmessage = (e) => {
  const msg = e.data;
  const type = msg.type;
  const payload = msg.payload;

  if (type === 'id') {
    postMessage({
      type: 'id',
      payload: hash.sha256().update(payload).digest('hex')
    });
  } else if (type === 'nonce') {
    const nonce = solver.solve(payload.complexity,
                               Buffer.from(payload.prefix, 'hex'));
    postMessage({
      type: 'nonce',
      payload: nonce.toString('hex')
    });
  }
};
