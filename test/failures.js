var sheetrock = require('../src/sheetrock');

QUnit.module('Test invalid user inputs.');

// Omit the spreadsheet URL.
QUnit.asyncTest('Omit the spreadsheet URL.', function() {

  QUnit.expect(1);

  // Load legacy-format spreadsheet.
  sheetrock({
    callback: function (error, options, data) {
      QUnit.ok(error.message === 'No key/gid in the provided URL.', error.message);
      QUnit.start();
    }
  });

});

// Load a spreadsheet URL without a key.
QUnit.asyncTest('Load a spreadsheet URL without a key.', function() {

  QUnit.expect(1);

  // Define invalid spreadsheet URL.
  var mySpreadsheet = 'https://docs.google.com/spreadsheet/';

  // Load legacy-format spreadsheet.
  sheetrock({
    url: mySpreadsheet,
    callback: function (error, options, data) {
      QUnit.ok(error.message === 'No key/gid in the provided URL.', error.message);
      QUnit.start();
    }
  });

});

// Load a spreadsheet URL without a gid.
QUnit.asyncTest('Load a spreadsheet URL without a gid.', function() {

  QUnit.expect(1);

  // Define invalid spreadsheet URL.
  var mySpreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=test';

  // Load legacy-format spreadsheet.
  sheetrock({
    url: mySpreadsheet,
    callback: function (error, options, data) {
      QUnit.ok(error.message === 'No key/gid in the provided URL.', error.message);
      QUnit.start();
    }
  });

});
