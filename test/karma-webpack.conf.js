'use strict';

var path = require('path');
var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    files: [
      'spec/browserify/**/*-spec.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ],
    preprocessors: {
      'spec/browserify/**/*-spec.js': ['webpack'],
      'spec/common/**/*-spec.js': ['webpack'],
      'spec/browser/**/*-spec.js': ['webpack']
    },
    webpack: {
      resolve: {
        alias: {
          bootstrappedData: '../../data/bootstrappedData.js',
          sheetrock: '../../../src/sheetrock.js',
          testData: '../../data/testData.js'
        }
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });

};
