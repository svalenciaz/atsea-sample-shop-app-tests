/* eslint-disable */
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
  },
  disableWarnings: true,
  fast: true,
  transpileOnly: true,
  require: ['tsconfig-paths/register'],
});

module.exports.config = require('./local.config.ts').config;
