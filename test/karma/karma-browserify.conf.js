/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    frameworks: ['jasmine', 'browserify'],
    files: [
      '../fixtures/**/*.json',
      'spec/browserify/**/*-spec.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ],
    preprocessors: {
      '../fixtures/**/*.json': ['json_fixtures'],
      'spec/browserify/**/*-spec.js': ['browserify'],
      'spec/common/**/*-spec.js': ['browserify'],
      'spec/browser/**/*-spec.js': ['browserify']
    }
  });

};
