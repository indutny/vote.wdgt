'use strict';

const micro = require('micro');
const server = require('./server');

micro(server);
