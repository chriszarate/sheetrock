import test from 'ava';
import { defaults } from '../../src/lib/config';
import Options from '../../src/lib/options';

test('options override defaults', (t) => {
  const userOptions = {
    callback: () => {},
    query: 'OVERRIDE',
  };
  const options = new Options(userOptions, true);
  t.is(options.user.query, 'OVERRIDE');
  t.is(options.user.url, '');
});

test('legacy options are supported', (t) => {
  const userOptions = {
    callback: () => {},
    sql: 'LEGACY',
  };
  const options = new Options(userOptions, true);
  t.is(options.user.query, 'LEGACY');
});

test('options rejects an invalid URL', (t) => {
  const userOptions = {
    callback: () => {},
    url: 'https://docs.google.com/spreadsheets/d/12345',
  };
  t.throws(() => new Options(userOptions), 'No key/gid in the provided URL.');
});

test('options requires a callback or DOM target', (t) => {
  t.throws(() => new Options(), 'No element targeted or callback provided.');
});

test('defaults can be overridden globally', (t) => {
  const override = {
    callback: () => {},
    query: 'OVERRIDE',
    url: 'OVERRIDE',
  };

  Object.assign(defaults, override);

  const userOptions = {
    query: 'RUNTIME_VALUE',
  };
  const options = new Options(userOptions, true);

  t.is(options.user.callback, override.callback);
  t.is(options.user.query, 'RUNTIME_VALUE');
  t.is(options.user.url, 'OVERRIDE');
});
