/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    files: [
      'https://code.jquery.com/jquery-1.12.4.min.js',
      '../../dist/sheetrock.min.js',
      '../fixtures/**/*.json',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js',
      'spec/jquery/**/*-spec.js'
    ]
  });

};
