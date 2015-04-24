'use strict';

var sharedConfig = require('./karma-shared.conf.js');

/*jshint camelcase: false*/
/*jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
var browsers = {
  sl_android_latest: {
    base: 'SauceLabs',
    browserName: 'android',
    deviceName: 'Android Emulator'
  },
  sl_chrome_latest: {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  sl_firefox_latest: {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  sl_ie_latest: {
    base: 'SauceLabs',
    browserName: 'internet explorer'
  },
  sl_ios_safari_latest: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone Simulator'
  },
  sl_safari_latest: {
    base: 'SauceLabs',
    browserName: 'safari'
  }
};

module.exports = function (config) {

  sharedConfig(config);

  config.set({
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,
    captureTimeout: 4 * 60 * 1000,
    customLaunchers: browsers,
    browsers: Object.keys(browsers),
    files: [
      '../src/sheetrock.js',
      'spec/common/**/*-spec.js',
      'spec/browser/**/*-spec.js'
    ],
    reporters: ['dots', 'saucelabs'],
    sauceLabs: {
      startConnect: false,
      testName: 'Sheetrock',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    }
  });

};
