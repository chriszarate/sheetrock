import test from 'ava';
import sheetrock from '../../src';

import edgeCases from '../fixtures/edge-cases.json';

test('sheetrock loads edge case data', (t) => {
  function callback(error, options, response) {
    t.is(error, null);
    t.is(response.raw, edgeCases);

    // Pulls labels from column IDs.
    t.deepEqual(response.rows[0].labels, ['A', 'B', 'C', 'D', 'E', 'L']);

    // Joins array values.
    t.is(response.rows[1].cellsArray[0], '123');

    // Defaults to empty string.
    t.is(response.rows[1].cellsArray[1], '');
  }

  sheetrock({ callback }, edgeCases);
});
