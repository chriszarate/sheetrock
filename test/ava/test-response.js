import test from 'ava';
import sinon from 'sinon';

import bootstrapped from '../fixtures/bootstrapped.json';
import Options from '../../src/lib/options';
import Request from '../../src/lib/request';
import Response from '../../src/lib/response';

const userOptions = {
  callback: () => {},
  url: 'https://docs.google.com/spreadsheets/d/12345/edit#gid=0',
};
const options = new Options(userOptions);
const request = new Request(options);
const response = new Response(request);

test('response exposes expected properties', (t) => {
  t.is(response.request, request);
});

test('response can load data', (t) => {
  const spy = sinon.spy();
  response.loadData(bootstrapped, spy);

  t.is(response.raw, bootstrapped);
  t.is(typeof response.attributes, 'object');
  t.is(typeof response.html, 'string');
  t.is(typeof response.rows, 'object');
  t.true(spy.calledWith(null));
});
