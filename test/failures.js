QUnit.module('Test invalid user inputs.');

// Don't provide a data handler.
QUnit.asyncTest("Don't provide a data handler.", function() {

  QUnit.expect(1);

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    errorHandler: function(options, data, msg) {
      QUnit.ok(msg === 'No element targeted or callback provided.', msg);
      QUnit.start();
    }
  });

});

// Omit the spreadsheet URL.
QUnit.asyncTest('Omit the spreadsheet URL.', function() {

  QUnit.expect(1);

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    errorHandler: function(options, data, msg) {
      QUnit.ok(msg === 'No key/gid in the provided URL.', msg);
      QUnit.start();
    },
    callback: function() {
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
  jQuery.fn.sheetrock({
    url: mySpreadsheet,
    errorHandler: function(options, data, msg) {
      QUnit.ok(msg === 'No key/gid in the provided URL.', msg);
      QUnit.start();
    },
    callback: function() {
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
  jQuery.fn.sheetrock({
    url: mySpreadsheet,
    errorHandler: function(options, data, msg) {
      QUnit.ok(msg === 'No key/gid in the provided URL.', msg);
      QUnit.start();
    },
    callback: function() {
      QUnit.start();
    }
  });

});
