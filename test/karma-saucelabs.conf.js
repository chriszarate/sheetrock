'use strict';

var sharedConfig = require('./karma-shared.conf.js');

/*jshint camelcase: false*/
/*jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
var browsers = {
  sl_android_5_1: {
    base: 'SauceLabs',
    browserName: 'android',
    deviceName: 'Android Emulator',
    platform: 'Linux',
    version: '5.1'
  },
  sl_android_4_4: {
    base: 'SauceLabs',
    browserName: 'android',
    deviceName: 'Android Emulator',
    platform: 'Linux',
    version: '4.4'
  },
  sl_chrome_40: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 8.1',
    version: '40.0'
  },
  sl_firefox_30: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '30.0'
  },
  sl_firefox_20: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '20.0'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10'
  },
  sl_ios_safari_8: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone Simulator',
    platform: 'OS X 10.10',
    version: '8.2'
  },
  sl_ios_safari_7: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone Simulator',
    platform: 'OS X 10.10',
    version: '7.1'
  },
  sl_ios_safari_6: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone Simulator',
    platform: 'OS X 10.10',
    version: '6.1'
  },
  sl_safari_8: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
    version: '8.0'
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
