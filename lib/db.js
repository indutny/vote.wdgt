'use strict';

const redis = require('redis');

const PREFIX = 'vote/';

function DB(url) {
  this.redis = redis.createClient(url);
}
module.exports = DB;

DB.prototype.increment = async function increment(id) {
  return new Promise((resolve, reject) => {
    this.redis.incr(PREFIX + id, (err, value) => {
      if (err)
        return reject(err);

      resolve(value);
    });
  });
};

DB.prototype.get = async function get(id) {
  return new Promise((resolve, reject) => {
    this.redis.get(PREFIX + id, (err, value) => {
      if (err)
        return resolve(0);

      resolve(value >>> 0);
    });
  });
};
