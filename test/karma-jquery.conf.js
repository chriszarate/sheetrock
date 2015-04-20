'use strict';

var sharedConfig = require('./karma-shared.conf.js');

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    files: [
      'lib/jquery.min.js',
      '../src/sheetrock.js',
      'spec/jquery/jquery-spec.js'
    ]
  });

};
