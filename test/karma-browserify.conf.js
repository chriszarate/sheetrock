'use strict';

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    frameworks: ['jasmine', 'browserify'],
    files: [
      'spec/browserify/**/*-spec.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ],
    preprocessors: {
      'spec/browserify/**/*-spec.js': ['browserify'],
      'spec/common/**/*-spec.js': ['browserify'],
      'spec/browser/**/*-spec.js': ['browserify']
    }
  });

};
