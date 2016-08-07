import test from 'ava';
import sinon from 'sinon';

import transport from '../../src/lib/transport';

const mockResponse = {
  loadData: sinon.spy(),
  request: {
    url: 'http://google.com/404',
  },
};

test.cb('transport fails to load an missing URL', (t) => {
  t.plan(3);

  transport(mockResponse, (error) => {
    t.is(error.message, 'Request failed.');
    t.is(error.code, 404);
    t.is(mockResponse.loadData.callCount, 0);
    t.end();
  });
});
