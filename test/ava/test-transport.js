import test from 'ava';
import sinon from 'sinon';

import transport from '../../src/lib/transport';

function macro(t, url, errorMessage, errorCode) {
  const mockResponse = {
    loadData: sinon.spy(),
    request: { url },
  };

  t.plan(3);

  transport(mockResponse, (error) => {
    t.is(error.message, errorMessage);
    t.is(error.code, errorCode);
    t.is(mockResponse.loadData.callCount, 0);
    t.end();
  });
}

const testArgs = [
  ['http://google.com/404', 'Request failed.', 404],
  ['not even trying', 'Invalid URI "not%20even%20trying"', null],
];

test.cb('transport fails to load 404 URL', macro, ...testArgs[0]);
test.cb('transport fails to load invalid URL', macro, ...testArgs[1]);
