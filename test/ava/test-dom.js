import test from 'ava';
import sinon from 'sinon';
import sheetrock from '../../src';

import bootstrapped from '../fixtures/bootstrapped.json';

// Create a thin mock of DOM element.
const target = {
  className: '',
  nodeType: 1,
  tagName: 'TABLE',
};

test('sheetrock interacts with dom', (t) => {
  target.insertAdjacentHTML = sinon.spy();

  function callback(error, options, response) {
    t.is(error, null);
    t.true(target.insertAdjacentHTML.calledOnce);

    // Check HTML output for header and body.
    t.true(response.html.indexOf('<thead><tr><th>Team</th>') !== -1);
    t.true(response.html.indexOf('<td>MON</td><td>LF</td><td>Tim</td><td>Raines</td>') !== -1);
  }

  sheetrock({ callback, target }, bootstrapped);
});

test('sheetrock accepts a jquery-like object as context (chaining)', (t) => {
  // Create mock of jQuery object.
  const blob = [target];
  target.insertAdjacentHTML = sinon.spy();
  blob.jquery = true;

  const returnValue = sheetrock.call(blob, {}, bootstrapped);

  t.is(returnValue, blob);
  t.true(target.insertAdjacentHTML.calledOnce);
});
