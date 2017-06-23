'use strict';

const fs = require('fs');
const micro = require('micro');

let CONFIG = require('./config');
if (process.argv[2])
  CONFIG = JSON.parse(fs.readFileSync(process.argv[2]).toString());

const App = require('./').App;

const PORT = process.env.NODE_PORT || 8000;
const HOST = process.env.NODE_HOST || '::';

const server = micro(new App(CONFIG).dispatch()).listen(PORT, HOST, () => {
  /* eslint-disable no-console */
  console.log('Listening on %j', server.address());
  /* eslint-enable no-console */
});
