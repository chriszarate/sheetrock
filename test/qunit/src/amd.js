/*global define, window */

'use strict';

define(['../../../src/sheetrock', '../lib/qunit.min', './common'], function (sheetrock, qunit, commonTests) {

  qunit.module('Load Sheetrock with AMD.');

  qunit.test('Test global', function (assert) {
    assert.expect(1);
    assert.ok(window.sheetrock === undefined, 'Sheetrock global is undefined.');
  });

  commonTests(qunit, sheetrock);
  qunit.start();

});
