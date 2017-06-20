'use strict';

const redis = require('redis');
const LRU = require('lru-cache');

const PREFIX = 'vote/';

function DB(url) {
  this.redis = redis.createClient(url);
  this.lru = new LRU({
    max: 100000,
    maxAge: 60 * 1000
  });
}
module.exports = DB;

DB.prototype.increment = async function increment(id) {
  const key = PREFIX + id;
  return new Promise((resolve, reject) => {
    this.redis.incr(PREFIX + id, (err, value) => {
      if (err)
        return reject(err);

      value >>>= 0;
      this.lru.set(key, value);
      resolve(value);
    });
  });
};

DB.prototype.get = async function get(id) {
  const key = PREFIX + id;
  if (this.lru.has(key))
    return this.lru.get(key);

  return new Promise((resolve) => {
    this.redis.get(key, (err, value) => {
      if (err)
        return resolve(0);

      value >>>= 0;
      this.lru.set(key, value);
      resolve(value);
    });
  });
};
