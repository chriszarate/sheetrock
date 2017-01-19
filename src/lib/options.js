import * as config from './config';
import { extractElement } from './util';

import SheetrockError from './error';

// Support some legacy option names.
function translateLegacyOptions(options) {
  const newOptions = {};

  Object.keys(options).forEach((key) => {
    if ({}.hasOwnProperty.call(config.legacyOptions, key)) {
      newOptions[config.legacyOptions[key]] = options[key];
    } else {
      newOptions[key] = options[key];
    }
  });

  return newOptions;
}

function setUserOptions(options) {
  const validatedOptions = {};

  // Look for valid DOM element target.
  validatedOptions.target = extractElement(options.target);

  // Correct bad integer values.
  validatedOptions.fetchSize = Math.max(0, parseInt(options.fetchSize, 10) || 0);

  // Require DOM element or a callback function. Otherwise, the data has nowhere to go.
  if (!validatedOptions.target && !options.callback && !config.defaults.callback) {
    throw new SheetrockError('No element targeted or callback provided.');
  }

  // Extend default options.
  return Object.assign({}, config.defaults, options, validatedOptions);
}

function setRequestOptions(options, data) {
  // If the user passed data, we don't want to validate the URL.
  if (data) {
    return { data };
  }

  // Get API endpoint, key, and gid from a Google Sheet URL.
  let sheetType = null;
  Object.keys(config.sheetTypes).forEach((key) => {
    const value = config.sheetTypes[key];
    if (value.keyFormat.test(options.url) && value.gidFormat.test(options.url)) {
      sheetType = value;
    }
  });

  if (sheetType) {
    const sheetKey = options.url.match(sheetType.keyFormat)[1];
    return {
      key: sheetKey,
      gid: options.url.match(sheetType.gidFormat)[1],
      apiEndpoint: sheetType.apiEndpoint.replace('%key%', sheetKey),
    };
  }

  // Require a Sheet key and gid.
  throw new SheetrockError('No key/gid in the provided URL.');
}

class Options {
  constructor(options = {}, data = false) {
    this.user = setUserOptions(translateLegacyOptions(options));
    this.request = setRequestOptions(this.user, data);

    // Generate a request ID that can be used as a caching key.
    this.requestIndex = `${this.request.key}_${this.request.gid}_${this.user.query}`;
  }
}

export default Options;
