module('Test invalid user inputs.');

// Don't provide a data handler.
asyncTest("Don't provide a data handler.", function() {

  expect(1);

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    errorHandler: function(data, msg) {
      ok(msg === 'No element targeted or data handler provided.', msg);
      start();
    }
  });

});

// Omit the spreadsheet URL.
asyncTest('Omit the spreadsheet URL.', function() {

  expect(1);

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    errorHandler: function(data, msg) {
      ok(msg === 'No spreadsheet URL provided.', msg);
      start();
    },
    dataHandler: function() {
      start();
    }
  });

});

// Load a spreadsheet URL without a key.
asyncTest('Load a spreadsheet URL without a key.', function() {

  expect(1);

  // Define invalid spreadsheet URL.
  var mySpreadsheet = 'https://docs.google.com/spreadsheet/';

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    url: mySpreadsheet,
    errorHandler: function(data, msg) {
      ok(msg === 'Could not find a key in the provided URL.', msg);
      start();
    },
    dataHandler: function() {
      start();
    }
  });

});

// Load a spreadsheet URL without a gid.
asyncTest('Load a spreadsheet URL without a gid.', function() {

  expect(1);

  // Define invalid spreadsheet URL.
  var mySpreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=test';

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    url: mySpreadsheet,
    errorHandler: function(data, msg) {
      ok(msg === 'Could not find a gid in the provided URL.', msg);
      start();
    },
    dataHandler: function() {
      start();
    }
  });

});
