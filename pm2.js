'use strict';

const micro = require('micro');
const app = require('./server');

const server = micro(app).listen(process.env.NODE_PORT || 8000, () => {
  /* eslint-disable no-console */
  console.log('Listening on %j', server.address());
  /* eslint-enable no-console */
});
