import test from 'ava';
import sinon from 'sinon';
import sheetrock from '../../src';

import expected from '../fixtures/expected.json';

function main(t, url, firstRequest = true) {
  if (firstRequest) {
    t.plan(17);
  } else {
    t.plan(13);
  }

  const testOptions = {
    fetchSize: 10,
    labels: Object.keys(expected.output.rows.row10),
    query: 'select A,B,C,D,E,L where E = "Both" order by L desc',
    rowTemplate: sinon.spy(),
    url,
  };
  const expectedLength = (firstRequest) ? testOptions.fetchSize + 1 : testOptions.fetchSize;

  testOptions.callback = (error, options, response) => {
    t.is(error, null);

    t.is(typeof options.request, 'object');
    t.is(typeof options.user, 'object');

    t.is(typeof response.attributes, 'object');
    t.is(typeof response.html, 'string');
    t.is(typeof response.raw, 'object');
    t.is(typeof response.rows, 'object');

    t.is(response.raw.status, 'ok');
    t.is(response.raw.table.cols.length, testOptions.labels.length);
    t.is(response.raw.table.rows.length, testOptions.fetchSize + 1);

    t.true(Array.isArray(response.rows));
    t.is(response.rows.length, expectedLength);

    t.is(testOptions.rowTemplate.callCount, testOptions.fetchSize);

    if (firstRequest) {
      t.deepEqual(response.rows[10].labels, Object.keys(response.rows[10].cells));
      t.deepEqual(response.rows[10].cells, expected.output.rows.row10);
      t.is(response.rows[10].cellsArray.length, response.rows[10].labels.length);
      t.is(response.rows[10].num, 10);
    }

    t.end();
  };

  sheetrock(testOptions);
}

expected.formats.forEach((format) => {
  test.serial.cb(`sheetrock ${format.description}`, main, format.url);
});

// Make another request for additional data.
const format = expected.formats[1];
test.serial.cb(`sheetrock ${format.description}`, main, format.url, false);
