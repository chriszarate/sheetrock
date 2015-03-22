/*global window, QUnit, sheetrock */
/*jslint indent: 2, vars: true */

'use strict';

QUnit.module('Load Sheetrock with vanilla JS.');

QUnit.test('Test global', function (assert) {
  assert.expect(1);
  assert.ok(window.sheetrock !== undefined, 'Sheetrock global is defined.');
});

QUnit.test('Load a legacy-format spreadsheet.', function (assert) {

  var done = assert.async();

  assert.expect(5);

  sheetrock({
    url: 'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0',
    query: 'select A,B,C,D,E,L where E = \'Both\' order by L desc',
    callback: function (error, options, data) {
      if (!error) {
        assert.ok(/tqx=responseHandler:/.test(options.request.url), 'Request URL used JSONP transport.');
        assert.ok(data.status === 'ok', 'Valid response from Google API.');
        assert.ok(data.table.cols.length === 6, 'Response contains 6 columns.');
        assert.ok(data.table.rows.length === 35, 'Response contains 35 rows.');
        assert.ok(data.table.rows[2].c[3].v === 'Bass', 'Row 3, column 4 contains "Bass".');
        done();
      }
    }
  });

});
