/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {
  sharedConfig(config);

  config.set({
    files: [
      '../fixtures/**/*.json',
      'spec/requirejs/**/*-spec.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ],
    preprocessors: {
      '../fixtures/**/*.json': ['json_fixtures'],
      'spec/requirejs/**/*-spec.js': ['webpack'],
      'spec/common/**/*-spec.js': ['webpack'],
      'spec/browser/**/*-spec.js': ['webpack']
    },
    webpack: {
      resolve: {
        alias: {
          sheetrock: '../../../../dist/sheetrock.min.js'
        }
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
