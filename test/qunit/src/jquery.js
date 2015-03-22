/*global $, QUnit, sheetrock, commonTests */

'use strict';

QUnit.module('Load Sheetrock alongside jQuery.');

QUnit.test('Test global', function (assert) {
  assert.expect(2);
  assert.ok(sheetrock !== undefined, 'Sheetrock global is defined.');
  assert.ok($.fn.sheetrock !== undefined, 'Sheetrock jQuery plugin is defined.');
});

commonTests(QUnit, $.fn.sheetrock);
