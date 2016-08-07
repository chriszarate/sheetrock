/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {
  sharedConfig(config);

  config.set({
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {
        pattern: '../../dist/sheetrock.min.js',
        included: false
      },
      {
        pattern: '../fixtures/**/*.json',
        included: false
      },
      {
        pattern: 'spec/requirejs/requirejs-spec.js',
        included: false
      },
      {
        pattern: 'spec/common/**/*-spec.js',
        included: false
      },
      {
        pattern: 'spec/browser/**/*-spec.js',
        included: false
      },
      'loaders/requirejs.js'
    ]
  });
};
