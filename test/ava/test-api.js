import test from 'ava';
import sheetrock from '../../src';

function testType(t, value, expectedType) {
  t.is(typeof value, expectedType);
}

test('module exports a function', testType, sheetrock, 'function');
test('module exposes defaults', testType, sheetrock.defaults, 'object');
test('module exposes a version number', testType, sheetrock.version, 'string');
