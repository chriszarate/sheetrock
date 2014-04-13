module('Test legacy and new formats of Google spreadsheets.');

// Load a legacy-format spreadsheet.
asyncTest('Load a legacy-format spreadsheet.', function() {

  expect(4);

  // Define legacy-format spreadsheet URL.
  var myLegacySpreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0';

  // Load legacy-format spreadsheet.
  jQuery.fn.sheetrock({
    url: myLegacySpreadsheet,
    sql: "select A,B,C,D,E,L where E = 'Both' order by L desc",
    errorHandler: function() {
      start();
    },
    dataHandler: function(data) {
      ok(data.status === 'ok', 'Received valid response from Google API.');
      ok(data.table.cols.length === 6, 'Expect 6 columns.');
      ok(data.table.rows.length === 35, 'Expect 35 columns.');
      ok(data.table.rows[0].c[0].v === 'MON', 'First cell should contain "MON".');
      start();
    }
  });

});

// Load a new-format spreadsheet ("new Sheets").
asyncTest('Load a new-format spreadsheet.', function() {

  expect(4);

  // Define new-format spreadsheet URL.
  var myNewSpreadsheet = 'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0';

  // Load new-format spreadsheet.
  jQuery.fn.sheetrock({
    url: myNewSpreadsheet,
    sql: "select A,B,C,D,E,L where E = 'Both' order by L desc",
    errorHandler: function() {
      start();
    },
    dataHandler: function(data) {
      ok(data.status === 'ok', 'Received valid response from Google API.');
      ok(data.table.cols.length === 6, 'Expect 6 columns.');
      ok(data.table.rows.length === 35, 'Expect 35 columns.');
      ok(data.table.rows[0].c[0].v === 'MON', 'First cell should contain "MON".');
      start();
    }
  });

});
