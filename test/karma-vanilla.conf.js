'use strict';

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    files: [
      '../src/sheetrock.js',
      'spec/common/**/*-spec.js'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      '../src/sheetrock.js': ['coverage']
    }
  });

};
