/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {
  sharedConfig(config);

  config.set({
    files: [
      '../../dist/sheetrock.min.js',
      '../fixtures/**/*.json',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ]
  });
};
