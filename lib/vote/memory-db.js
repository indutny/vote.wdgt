'use strict';

function MemoryDB() {
  this.map = new Map();
}
module.exports = MemoryDB;

MemoryDB.prototype.increment = function increment(id) {
  if (this.map.has(id)) {
    const val = this.map.get(id) + 1;
    this.map.set(id, val);
    return val;
  }

  this.map.set(id, 1);
  return 1;
};

MemoryDB.prototype.has = function has(id) {
  return this.map.has(id);
};

MemoryDB.prototype.get = function get(id) {
  if (this.map.has(id))
    return this.map.get(id);

  return 0;
};

MemoryDB.prototype.set = function set(id, value) {
  this.map.set(id, value);
};
