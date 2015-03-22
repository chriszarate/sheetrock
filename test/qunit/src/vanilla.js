/*global window, QUnit, sheetrock, commonTests */

'use strict';

QUnit.module('Load Sheetrock with vanilla JS.');

QUnit.test('Test global', function (assert) {
  assert.expect(1);
  assert.ok(window.sheetrock !== undefined, 'Sheetrock global is defined.');
});

commonTests(QUnit, sheetrock);
