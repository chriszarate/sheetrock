'use strict';

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    files: [
      'lib/jquery.min.js',
      'lib/unset-prototypes.js',
      '../src/sheetrock.js',
      'spec/common/**/*-spec.js',
      'spec/coverage/**/*-spec.js',
      'spec/jquery/**/*-spec.js'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      '../src/sheetrock.js': ['coverage']
    }
  });

};
