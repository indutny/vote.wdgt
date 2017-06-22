'use strict';

const micro = require('micro');
const app = require('./server');

const PORT = process.env.NODE_PORT || 8000;
const HOST = process.env.NODE_HOST || '::';

const server = micro(app).listen(PORT, HOST, () => {
  /* eslint-disable no-console */
  console.log('Listening on %j', server.address());
  /* eslint-enable no-console */
});
