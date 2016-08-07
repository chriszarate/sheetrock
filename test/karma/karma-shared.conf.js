/* eslint-disable */
var path = require('path');

module.exports = function (config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../fixtures/**/*.json': ['json_fixtures']
    },

    jsonFixturesPreprocessor: {
      stripPrefix: path.join(__dirname, '..', 'fixtures/')
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['InsecureTLSPhantomJS'],

    // you can define custom flags
    customLaunchers: {
      'DebuggingPhantomJS': {
        base: 'PhantomJS',
        flags: ['--ignore-ssl-errors=true']
      },
      // Needed to ignore SSL errors that otherwise block API requests.
      // https://github.com/ariya/phantomjs/issues/12181
      'InsecureTLSPhantomJS': {
        base: 'PhantomJS',
        flags: ['--ignore-ssl-errors=true']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  });
};
