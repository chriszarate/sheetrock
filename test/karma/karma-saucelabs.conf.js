/* eslint-disable */

var sharedConfig = require('./karma-shared.conf.js');

var browsers = {
  sl_android_latest: {
    base: 'SauceLabs',
    browserName: 'android',
    deviceName: 'Android Emulator',
    platform: '5.1'
  },
  sl_chrome_latest: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7'
  },
  sl_firefox_latest: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7'
  },
  sl_ie_latest: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1'
  },
  sl_ios_safari_8: {
    base: 'SauceLabs',
    browserName: 'iphone',
    deviceName: 'iPhone Simulator',
    platform: 'OS X 10.10',
    version: '8.2'
  },
  sl_safari_latest: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10'
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
      '../../dist/sheetrock.min.js',
      '../fixtures/**/*.json',
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
