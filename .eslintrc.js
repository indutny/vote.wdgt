module.exports = {
  'env': {
    'browser': false,
    'commonjs': true,
    'node': true,
    'es6': true
  },
  'parserOptions': {
    'ecmaVersion': 8
  },
  'extends': 'eslint:recommended',
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
