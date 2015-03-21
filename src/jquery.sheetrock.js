/*!
 * jquery-sheetrock v0.3.0
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * http://chriszarate.github.io/sheetrock/
 * License: MIT
 */

/*global define, module, require */
/*jslint vars: true, indent: 2 */

(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function (jquery) {
      factory(jquery, root.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'), root.document);
  } else {
    root.Sheetrock = factory(root.jQuery, root.document);
  }

}(this, function ($, document) {

  'use strict';

  // Determine if we have access to jQuery.
  var jQueryAvailable = $ && $.fn && $.fn.jquery;

  // Google Visualization API endpoints and parameter formats
  var sheetTypes = {
    '2014': {
      'apiEndpoint': 'https://docs.google.com/spreadsheets/d/%key%/gviz/tq',
      'keyFormat': new RegExp('spreadsheets/d/([^/#]+)', 'i'),
      'gidFormat': new RegExp('gid=([^/&#]+)', 'i')
    },
    '2010': {
      'apiEndpoint': 'https://spreadsheets.google.com/tq?key=%key%',
      'keyFormat': new RegExp('key=([^&#]+)', 'i'),
      'gidFormat': new RegExp('gid=([^/&#]+)', 'i')
    }
  };

  // Placeholder for request status cache
  var requestStatusCache = {
    loaded: {},
    failed: {},
    offset: {}
  };

  // JSONP callback function index
  var jsonpCallbackIndex = 0;


  /* Polyfills */

  // Radically simplified polyfills for narrow use cases.

  if (!Array.prototype.forEach) {
    /*jshint freeze: false */
    Array.prototype.forEach = function (func) {
      var i;
      var array = this;
      var arrayLength = array.length;
      for (i = 0; i < arrayLength; i = i + 1) {
        func(array[i], i);
      }
    };
  }

  if (!Array.prototype.map) {
    /*jshint freeze: false */
    Array.prototype.map = function (func) {
      var array = this;
      var resultArray = [];
      array.forEach(function (value, i) {
        resultArray[i] = func(value);
      });
      return resultArray;
    };
  }

  if (!Object.keys) {
    Object.keys = function (object) {
      var key;
      var array = [];
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          array.push(key);
        }
      }
      return array;
    };
  }


  /* Helpers */

  // General error handler.
  var handleError = function (options, data, msg) {

    var error = new Error(msg || 'Request failed.');

    // Remember that this request failed.
    if (options && options.request && options.request.index) {
      requestStatusCache.failed[options.request.index] = true;
    }

    // Call the user's callback function.
    if (options.user.callback) {
      options.user.callback(error, options, data);
    }

    throw error;

  };

  // Trim a string of leading and trailing spaces.
  var trim = function (str) {
    return str.toString().replace(/^ +/, '').replace(/ +$/, '');
  };

  // Parse a string as a natural number (>=0).
  var stringToNaturalNumber = function (str) {
    return Math.max(0, parseInt(str, 10) || 0);
  };

  // Return true if an object has all of the passed arguments as properties.
  var has = function (obj) {
    var i;
    var length = arguments.length;
    for (i = 1; i < length; i = i + 1) {
      if (obj[arguments[i]] === undefined) {
        return false;
      }
    }
    return true;
  };

  // Extract a DOM element from a possible jQuery blob.
  var extractElement = function (blob) {
    blob = blob || {};
    if (blob.jquery && blob.length) {
      blob = blob[0];
    }
    return (blob.nodeType && blob.nodeType === 1) ? blob : false;
  };

  var extendDefaults = function (defaults, options) {
    var extended = {};
    var defaultKeys = Object.keys(defaults);
    defaultKeys.forEach(function (key) {
      extended[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
    });
    return extended;
  };

  // Log something to the browser console, if it exists. The argument "show"
  // is a Boolean (default = true) that determines whether to proceed.
  var log = function (message, debug) {
    var show = (debug === undefined) || debug;
    /*jshint devel: true */
    /*jslint devel: true */
    if (show && console && console.log) {
      console.log(message);
    }
    return false;
  };

  // Get API endpoint, key, and gid from a Google Sheet URL.
  var getRequestOptions = function (url) {
    var requestOptions = {};
    var sheetTypeKeys = Object.keys(sheetTypes);
    sheetTypeKeys.forEach(function (key) {
      var sheetType = sheetTypes[key];
      if (sheetType.keyFormat.test(url) && sheetType.gidFormat.test(url)) {
        requestOptions.key = url.match(sheetType.keyFormat)[1];
        requestOptions.gid = url.match(sheetType.gidFormat)[1];
        requestOptions.apiEndpoint = sheetType.apiEndpoint.replace('%key%', requestOptions.key);
      }
    });
    return requestOptions;
  };

  // Extract the label, if present, from a column object, sans white space.
  var getColumnLabel = function (col) {
    return (has(col, 'label')) ? col.label.replace(/\s/g, '') : null;
  };

  // Map function: Return the label or letter of a column object.
  var getColumnLabelOrLetter = function (col) {
    return getColumnLabel(col) || col.id;
  };

  // Convert an array to a object.
  var arrayToObject = function (array) {
    var object = {};
    array.forEach(function (value) {
      object[value] = value;
    });
    return object;
  };

  // Wrap a string in tag. The style argument, if present, is populated into
  // an inline CSS style attribute. (Gross!)
  var wrapTag = function (str, tag) {
    return '<' + tag + '>' + str + '</' + tag + '>';
  };

  // Default row handler: Output a row object as an HTML table row.
  // Use "td" for table body row, "th" for table header rows.
  var toHTML = function (row) {
    var tag = (row.num) ? 'td' : 'th';
    var cells = Object.keys(row.cells);
    var html = '';
    cells.forEach(function (key) {
      html += wrapTag(row.cells[key], tag);
    });
    return wrapTag(html, 'tr');
  };

  // If user requests it, reset any cached request status.
  var resetRequestStatus = function (index) {
    requestStatusCache.loaded[index] = false;
    requestStatusCache.failed[index] = false;
    requestStatusCache.offset[index] = 0;
    log('Resetting request status.');
  };

  // Make user's options available to callback functions with a closure.
  var createClosure = function (func, options) {
    return function (data) {
      func(options, data);
    };
  };


  /* Options */

  // Validate the user-passed options.
  var validateUserOptions = function (target, options) {

    // Support some legacy option names.
    options.query = options.sql || options.query;
    options.reset = options.resetStatus || options.reset;

    // Validate DOM element target.
    options.target = extractElement(options.target) || extractElement(target);

    // Validate integer values.
    options.headers = stringToNaturalNumber(options.headers);
    options.chunkSize = stringToNaturalNumber(options.chunkSize);

    return options;

  };

  // Validate the processed options.
  var validateOptions = function (options) {

    // Require DOM element or a callback function. Otherwise, the data has nowhere to go.
    if (!options.user.target && !options.user.callback) {
      handleError(options, null, 'No element targeted or callback provided.');
    }

    // Require a Sheet key and gid.
    if (!(options.request.key && options.request.gid)) {
      handleError(options, null, 'No key/gid in the provided URL.');
    }

    // Abandon requests that have previously generated an error.
    if (requestStatusCache.failed[options.request.index]) {
      handleError(options, null, 'A previous request for this resource failed.');
    }

    // Abandon requests that have already been loaded.
    if (requestStatusCache.loaded[options.request.index]) {
      handleError(options, null, 'No more rows to load!');
    }

    // Log the validated options to the console, if requested.
    log(options, options.user.debug);

    return options;

  };

  // Process user-passed options.
  var processUserOptions = function (target, options) {

    var userOptions = validateUserOptions(target, options);
    var requestOptions = getRequestOptions(userOptions.url);

    // Set request query and index (key_gid_query).
    requestOptions.query = userOptions.query;
    requestOptions.index = requestOptions.key + '_' + requestOptions.gid + '_' + userOptions.query;

    // If requested, reset request status.
    if (userOptions.reset && requestOptions.index) {
      resetRequestStatus(requestOptions.index);
    }

    // Retrieve current row offset.
    userOptions.offset = requestStatusCache.offset[requestOptions.index] || 0;

    // If requested, make a request for chunked data.
    if (userOptions.chunkSize && requestOptions.index) {

      // Append a limit and row offest to the query to target the next chunk.
      requestOptions.query += ' limit ' + (userOptions.chunkSize + 1);
      requestOptions.query += ' offset ' + userOptions.offset;

      // Remember the new row offset.
      requestStatusCache.offset[requestOptions.index] = userOptions.offset + userOptions.chunkSize;

    }

    return validateOptions({
      user: userOptions,
      request: requestOptions
    });

  };

  // Get useful information about the response.
  var getResponseAttributes = function (options, data) {

    // Initialize a hash for the response attributes.
    var attributes = {};

    var chunkSize = options.user.chunkSize;
    var labels = options.user.labels;
    var rows = data.table.rows;
    var cols = data.table.cols;

    // The Google API generates an unrecoverable error when the 'offset' is
    // larger than the number of available rows, which is problematic for
    // chunked requests. As a workaround, we request one more row than we need
    // and stop when we see less rows than we requested.

    // Calculate the last returned row.
    attributes.last = Math.min(rows.length, chunkSize || rows.length);

    // Remember whether this request has been fully loaded.
    requestStatusCache.loaded[options.request.index] = !chunkSize || attributes.last < chunkSize;

    // Determine if Google has extracted column labels from a header row.
    attributes.header = (cols.map(getColumnLabel).length) ? 1 : 0;

    // If no column labels are provided or if there are too many or too few
    // compared to the returned data, use the returned column labels.
    attributes.labels = (labels && labels.length === cols.length) ? labels : cols.map(getColumnLabelOrLetter);

    // Return the response attributes.
    return attributes;

  };


  /* Data */

  // Enumerate any messages embedded in the API response.
  var enumerateMessages = function (data, state) {

    // Look for the specified property at the root of the response object.
    if (has(data, state)) {

      // Look for the kinds of messages we know about.
      data[state].forEach(function (status) {
        if (has(status, 'detailed_message')) {
          /*jshint camelcase: false */
          /*jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
          log(status.detailed_message);
          /*jscs: enable */
        } else if (has(status, 'message')) {
          log(status.message);
        }
      });

    }

  };

  // Parse data, row by row.
  var parseData = function (options, data) {

    // Use row group tags (<thead>, <tbody>) if the target is a table.
    var isTable = (options.user.target.tagName === 'TABLE');
    var headerHTML = '';
    var bodyHTML = '';

    // Output a header row, if needed.
    if (!options.user.offset && !options.user.headersOff) {
      if (options.response.header || !options.user.headers) {
        headerHTML += options.user.rowHandler({
          num: 0,
          cells: arrayToObject(options.response.labels)
        });
      }
    }

    // Each table cell ('c') can contain two properties: 'p' contains
    // formatting and 'v' contains the actual cell value.

    // Loop through each table row.
    data.table.rows.forEach(function (obj, i) {

      // Proceed if the row has cells and the row index is within the targeted
      // range. (This avoids displaying too many rows when chunking data.)
      if (has(obj, 'c') && i < options.response.last) {

        // Get the "real" row index (not counting header rows).
        var counter = stringToNaturalNumber(options.user.offset + i + 1 + options.response.header - options.user.headers);

        // Initialize a row object, which will be passed to the row handler.
        var rowObject = {
          num: counter,
          cells: {}
        };

        // Suppress header row, if requested.
        if (counter || !options.user.headersOff) {

          // Loop through each cell in the row.
          obj.c.forEach(function (cell, x) {

            // Extract cell value.
            var value = (cell && has(cell, 'v') && cell.v) ? cell.v : '';

            // Avoid array cell values.
            if (value instanceof Array) {
              value = (has(cell, 'f')) ? cell.f : value.join('');
            }

            // Add the trimmed cell value to the row object, using the desired
            // column label as the key.
            rowObject.cells[options.response.labels[x]] = trim(value);

          });

          // Pass the row object to the row handler and append the output to
          // the target element.

          if (rowObject.num) {
            // Append to body section.
            bodyHTML += options.user.rowHandler(rowObject);
          } else {
            // Append to header section.
            headerHTML += options.user.rowHandler(rowObject);
          }

        }

      }

    });

    // Append to DOM.
    if (isTable) {
      var headerElement = document.createElement('thead');
      var bodyElement = document.createElement('tbody');
      headerElement.innerHTML = headerHTML;
      bodyElement.innerHTML = bodyHTML;
      options.user.target.appendChild(headerElement);
      options.user.target.appendChild(bodyElement);
    } else {
      options.user.target.insertAdjacentHTML('beforeEnd', headerHTML + bodyHTML);
    }

  };

  // Process API response.
  var processResponse = function (options, data) {

    enumerateMessages(data, 'warnings');
    enumerateMessages(data, 'errors');

    log(data, options.user.debug);

    // Make sure the response is populated with actual data.
    if (has(data, 'status', 'table') && has(data.table, 'cols', 'rows')) {

      // Add useful information about the response to the options hash.
      options.response = getResponseAttributes(options, data);

      // If there is an element being targeted, parse the data into HTML.
      if (options.user.target) {
        parseData(options, data);
      }

      // Call the user's callback function.
      if (options.user.callback) {
        options.user.callback(null, options, data);
      }

    } else {
      handleError(options, data, 'Unexpected API response format.');
    }

  };

  // Fetch the requested data using the user's options.
  var fetchData = function (options) {

    // Specify a custom callback function since Google doesn't use the
    // default implementation favored by jQuery.
    var jsonpCallbackName = 'sheetrock_callback_' + jsonpCallbackIndex;
    jsonpCallbackIndex = jsonpCallbackIndex + 1;

    // AJAX request options
    var request = {

      // Convert user options into AJAX request parameters.
      data: {
        gid: options.request.gid,
        tq: options.request.query,
        tqx: 'responseHandler:' + jsonpCallbackName
      },

      url: options.request.apiEndpoint,
      dataType: 'jsonp',
      cache: true,

      // Use custom callback function (see above).
      jsonp: false,
      jsonpCallback: jsonpCallbackName

    };

    // If debugging is enabled, log request details to the console.
    log(request, options.user.debug);

    // Send the request.
    //jQuery
    $.ajax(request)
      .done(createClosure(processResponse, options))
      .fail(createClosure(handleError, options));

  };


  /* Main */

  var main = function (target, options, bootstrappedData) {

    options = processUserOptions(target, options || {});

    if (bootstrappedData) {
      processResponse(options, bootstrappedData);
    } else {
      fetchData(options);
    }

  };


  /* API */

  // Documentation is available at:
  // https://github.com/chriszarate/sheetrock/

  // Changes to API in 1.0.0:
  // ------------------------
  // - *renamed* .options => .defaults
  // - *removed* .promise -- requests are no longer chained
  // - *removed* .working -- use callback function

  // - remove/merge labels option?
  // - remove/merge header options?

  var defaults = {

    // Changes to defaults in 1.0.0:
    // -----------------------------
    // - *added* target
    // - *renamed* sql => query
    // - *renamed* resetStatus => reset
    // - *removed* server -- pass data as parameter instead
    // - *removed* columns -- always use column letters in query
    // - *removed* cellHandler -- use rowHandler for text formatting
    // - *removed* errorHandler -- errors are passed to callback function
    // - *removed* loading -- use callback function
    // - *removed* rowGroups -- <thead>, <tbody> added when target is <table>
    // - *removed* formatting -- almost useless, impossible to support

    url:          '',          // String  -- Google Sheet URL
    query:        '',          // String  -- Google Visualization API query
    target:       null,        // DOM Element -- An element to append output to
    chunkSize:    0,           // Integer -- Number of rows to fetch (0 = all)
    labels:       [],          // Array   -- Override *returned* column labels
    rowHandler:   toHTML,      // Function
    callback:     false,       // Function
    headers:      0,           // Integer -- Number of header rows
    headersOff:   false,       // Boolean -- Suppress header row output
    reset:        false,       // Boolean -- Reset request status
    debug:        false        // Boolean -- Output raw data to the console

  };

  var sheetrock = function (options, bootstrappedData) {

    try {
      options = extendDefaults(defaults, options);
      main(this, options, bootstrappedData);
    } catch (err) {}

    return this;

  };

  sheetrock.defaults = defaults;
  sheetrock.version = '0.3.0';

  // If jQuery is available, register as a plugin.
  if (jQueryAvailable) {
    $.fn.sheetrock = sheetrock;
  }

  return sheetrock;

}));
