import test from 'ava';
import sheetrock from '../../src';

import bootstrapped from '../fixtures/bootstrapped.json';
import expected from '../fixtures/expected.json';

test('sheetrock loads bootstrapped data synchronously', (t) => {
  const labels = ['team', 'position', 'firstName', 'lastName', 'bats', 'average'];

  function callback(error, options, response) {
    t.is(error, null);

    t.is(typeof options.request, 'object');
    t.is(typeof options.user, 'object');

    t.is(typeof response.attributes, 'object');
    t.is(typeof response.html, 'string');
    t.is(typeof response.raw, 'object');
    t.is(typeof response.rows, 'object');

    t.is(response.raw, bootstrapped);

    t.true(Array.isArray(response.rows));

    t.deepEqual(response.rows[10].labels, Object.keys(response.rows[10].cells));
    t.deepEqual(response.rows[10].cells, expected.output.rows.row10);
    t.is(response.rows[10].cellsArray.length, response.rows[10].labels.length);
    t.is(response.rows[10].num, 10);
  }

  sheetrock({ callback, labels }, bootstrapped);
});

test('sheetrock rejects malformed bootstrapped data', (t) => {
  function callback(error) {
    t.is(error.message, 'Unexpected API response format.');
  }

  sheetrock({ callback }, {});
});
