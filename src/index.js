/*!
 * Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * https://chriszarate.github.io/sheetrock/
 * License: MIT
 */

/* global window */

import Options from './lib/options';
import Request from './lib/request';
import Response from './lib/response';

import { defaults } from './lib/config';
import transport from './lib/transport'; // Shimmed with 'transport-browser' in browser.

const version = '1.1.4';

function sheetrock(userOptions = {}, data = null) {
  let options = null;
  let request = null;
  let response = null;

  // Call the user's callback function or rethrow error.
  function handleError(error) {
    if (error && error.name === 'SheetrockError') {
      if (request && request.update) {
        request.update({ failed: true });
      }
    }

    if (userOptions.callback) {
      userOptions.callback(error, options, response);
      return;
    }

    if (error) {
      throw error;
    }
  }

  try {
    options = new Options(Object.assign({ target: this }, userOptions), !!data);
    request = new Request(options);
    response = new Response(request);
  } catch (error) {
    handleError(error);
  }

  if (data) {
    response.loadData(data, handleError);
  } else if (options && request && response) {
    transport(response, handleError);
  }

  return this;
}

Object.assign(sheetrock, { defaults, version });

// If jQuery is available as a global, register as a plugin.
try {
  window.jQuery.fn.sheetrock = sheetrock;
} catch (ignore) { /* empty */ }

export default sheetrock;
