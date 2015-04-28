'use strict';

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    coverageReporter: {
      type: 'lcov'
    },
    files: [
      'lib/jquery.min.js',
      'lib/unset-prototypes.js',
      '../src/sheetrock.js',
      'data/**/*.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js',
      'spec/coverage/**/*-spec.js',
      'spec/jquery/**/*-spec.js'
    ],
    reporters: ['coverage', 'dots'],
    preprocessors: {
      '../src/sheetrock.js': ['coverage']
    }
  });

};
