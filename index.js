'use strict';

const CONFIG = require('./config');

const App = require('./').App;

const app = new App(CONFIG);

module.exports = app.dispatch();
