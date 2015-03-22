var sheetrock = require('../../src/sheetrock');

exports.testBasic = function (test) {

  'use strict';

  // Define legacy-format spreadsheet URL.
  var myLegacySpreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0';

  test.expect(4);

  // Load legacy-format spreadsheet.
  sheetrock({
    url: myLegacySpreadsheet,
    query: 'select A,B,C,D,E,L where E = \'Both\' order by L desc',
    callback: function (error, options, data) {
      test.ok(data.status === 'ok', 'Received valid response from Google API.');
      test.ok(data.table.cols.length === 6, 'Expect 6 columns.');
      test.ok(data.table.rows.length === 35, 'Expect 35 columns.');
      test.ok(data.table.rows[0].c[0].v === 'MON', 'First cell should contain "MON".');
      test.done();
    }
  });

};
