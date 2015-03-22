'use strict';

var sheetrock = require('../../src/sheetrock');

var legacySheetURL = 'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0';
//var newSheetURL = 'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0';
var basicSheetQuery = 'select A,B,C,D,E,L where E = \'Both\' order by L desc';

var generateTest = function (sheetURL, sheetQuery) {

  return function (test) {

    test.expect(5);

    sheetrock({
      url: sheetURL,
      query: sheetQuery,
      callback: function (error, options, data) {
        if (!error) {
          test.ok(!/tqx=responseHandler:/.test(options.request.url), 'Request URL used JSON transport.');
          test.ok(data.status === 'ok', 'Valid response from Google API.');
          test.ok(data.table.cols.length === 6, 'Response contains 6 columns.');
          test.ok(data.table.rows.length === 35, 'Response contains 35 rows.');
          test.ok(data.table.rows[2].c[3].v === 'Bass', 'Row 3, column 4 contains "Bass".');
        }
        test.done();
      }
    });

  };

};

exports.testLegacyFormat = generateTest(legacySheetURL, basicSheetQuery);
//exports.testNewFormat = generateTest(newSheetURL, basicSheetQuery);
