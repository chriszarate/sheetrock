/*global define, window, QUnit */

'use strict';

define(['../../../src/sheetrock', './common'], function (sheetrock, commonTests) {

  QUnit.module('Load Sheetrock with AMD.');

  QUnit.test('Test global', function (assert) {
    assert.expect(1);
    assert.ok(window.sheetrock === undefined, 'Sheetrock global is undefined.');
  });

  commonTests(QUnit, sheetrock);

});
