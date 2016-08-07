import test from 'ava';
import Error from '../../src/lib/error';

test('error can be created', (t) => {
  const error = new Error();
  t.is(error.name, 'SheetrockError');
  t.is(error.message, '');
  t.is(error.code, null);
});

test('error message is available', (t) => {
  const error = new Error('test error message', 'test code');
  t.is(error.message, 'test error message');
  t.is(error.code, 'test code');
});
