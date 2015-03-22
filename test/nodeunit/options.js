'use strict';

var sheetrock = require('../../src/sheetrock');

var generateTest = function (options, message) {

  return function (test) {

    test.expect(1);

    options.callback = function (error) {
      test.ok(error && error.message === message, error.message);
      test.done();
    };

    sheetrock(options);

  };

};

exports.testMissingSheetURL = generateTest({}, 'No key/gid in the provided URL.');
exports.testMissingSheetKey = generateTest({url: 'https://docs.google.com/spreadsheet/'}, 'No key/gid in the provided URL.');
exports.testMissingSheetGid = generateTest({url: 'https://docs.google.com/spreadsheet/ccc?key=test'}, 'No key/gid in the provided URL.');
