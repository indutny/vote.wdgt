'use strict';

const path = require('path');
const webpack = require('webpack');

const DIST = path.join(__dirname, 'dist');
const SNIPPET = path.join(__dirname, 'snippet');

const loaders = [
  {
    test: /\.js(\.raw)?$/,
    loader: 'babel-loader',
    options: { presets: [ 'es2015' ] }
  }
];

module.exports = [{
  entry: path.join(SNIPPET, 'worker.js'),
  output: {
    path: DIST,
    filename: 'snippet-worker.js'
  },
  module: {
    loaders
  }
}, {
  entry: [ 'whatwg-fetch', path.join(SNIPPET, 'main.js') ],
  output: {
    path: DIST,
    filename: 'snippet.js'
  },
  module: {
    loaders
  }
}];
