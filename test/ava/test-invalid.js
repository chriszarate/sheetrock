import test from 'ava';
import sheetrock from '../../src';

// Use a random sheet ID so that failures aren't cached by request module.
const randomID = Math.floor(Math.random() * 100000);
const url = `http://10.255.255.1/spreadsheets/d/${randomID}#gid=0`;

function generateCallback(t, message) {
  return (error) => {
    t.is(error.message, message);
    t.end();
  };
}

test('sheetrock throws an error if there is no callback', (t) => {
  t.throws(() => sheetrock(), 'No element targeted or callback provided.');
});

test.serial.cb('sheetrock cannot fetch an invalid URL', (t) => {
  t.plan(1);

  sheetrock({
    url,
    callback: generateCallback(t, 'Request failed.'),
  });
});

test.serial.cb('sheetrock aborts previsouly failed request', (t) => {
  t.plan(1);

  sheetrock({
    url,
    callback: generateCallback(t, 'A previous request for this resource failed.'),
  });
});
