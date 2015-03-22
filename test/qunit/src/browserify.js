/*global window */

'use strict';

var qunit = require('qunitjs');
var sheetrock = require('../../../src/sheetrock');
var commonTests = require('./common');

qunit.module('Load Sheetrock with Browserify.');

qunit.test('Test global', function (assert) {
  assert.expect(1);
  assert.ok(window.sheetrock === undefined, 'Sheetrock global is undefined.');
});

commonTests(qunit, sheetrock);
