import test from 'ava';
import Options from '../../src/lib/options';
import Request from '../../src/lib/request';

const userOptions = {
  callback: () => {},
  url: 'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0',
};
const options = new Options(userOptions);
const request = new Request(options);

test('request generates request URL', (t) => {
  t.is('https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/gviz/tq?gid=0&tq=', request.url);
});

test('request provides initial default state', (t) => {
  const defaults = {
    failed: false,
    header: 0,
    labels: null,
    loaded: false,
    offset: 0,
  };

  t.deepEqual(request.state, defaults);
});

test('request state can be updated', (t) => {
  // Does not throw error due to default parameter.
  request.update();
  t.is(request.state.loaded, false);

  request.update({
    loaded: true,
  });
  t.is(request.state.loaded, true);
});

test('request state persists to subsequent requests', (t) => {
  t.throws(() => new Request(options), 'No more rows to load!');
});
