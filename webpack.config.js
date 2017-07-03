'use strict';

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ShakePlugin = require('webpack-common-shake').Plugin;

const DIST = path.join(__dirname, 'dist');
const SNIPPET = path.join(__dirname, 'snippet');

const loaders = [
  {
    test: /\.js(\.raw)?$/,
    loader: 'babel-loader',
    options: { presets: [ 'es2015' ] }
  }
];

const plugins = [
  new ShakePlugin({
    onGraph: process.env.SHAKE_GRAPH ? (dot) => {
      fs.writeFileSync(process.env.SHAKE_GRAPH, dot);
    } : false
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unsafe: true,
      unsafe_math: true,
      evaluate: true,
      unused: true,
      passes: 3
    },
    comments: false
  })
];

module.exports = [{
  entry: path.join(SNIPPET, 'worker.js'),
  output: {
    path: DIST,
    filename: 'snippet-worker.js'
  },
  module: {
    loaders
  },
  plugins
}, {
  entry: [ path.join(SNIPPET, 'main.js') ],
  output: {
    path: DIST,
    filename: 'snippet-v2.js'
  },
  module: {
    loaders
  },
  plugins
}];
