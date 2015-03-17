/*!
 * jquery-sheetrock v0.3.0
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * http://chriszarate.github.io/sheetrock/
 * License: MIT
 */

(function (root, factory) {

  'use strict';

  /* global define, module, require */

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('jquery'));
  } else {
    factory(root.jQuery || root.$);
  }

}(this, function ($) {

  'use strict';

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


  /* Helpers */

  // General error handler.
  var handleError = function (options, data, msg) {

    // Set error message.
    msg = msg || 'Request failed.';

    // Remember that this request failed.
    if (options && options.request && options.request.index) {
      requestStatusCache.failed[options.request.index] = true;
    }

    // Call the user's error handler.
    options.user.errorHandler(options, data, msg);

    throw msg;

  };

  // Trim a string of leading and trailing spaces.
  var trim = function (str) {
    return str.toString().replace(/^ +/, '').replace(/ +$/, '');
  };

  // Parse a string as a natural number (>=0).
  var stringToNaturalNumber = function (str) {
    return Math.max(0, parseInt(str, 10) || 0);
  };

  // Return true if all of the passed arguments are defined.
  var isDefined = function () {
    var i;
    var length = arguments.length;
    for (i = 0; i < length; i = i + 1) {
      if (arguments[i] === undefined) {
        return false;
      }
    }
    return true;
  };

  // Return true if an object has all of the passed arguments as properties.
  var has = function (obj) {
    var i;
    var length = arguments.length;
    for (i = 1; i < length; i = i + 1) {
      if (!isDefined(obj[arguments[i]])) {
        return false;
      }
    }
    return true;
  };

  // Log something to the browser console, if it exists. The argument "show"
  // is a Boolean (default = true) that determines whether to proceed.
  var log = function (message, debug) {
    var show = (debug === undefined) || debug;
    /* jshint devel: true */
    if (show && console && console.log) {
      console.log(message);
    }
    return false;
  };

  // Get API endpoint, key, and gid from a Google Sheet URL.
  var getRequestOptions = function (url) {

    var requestOptions = {};

    $.each(sheetTypes, function (typeKey, sheetType) {
      if (sheetType.keyFormat.test(url) && sheetType.gidFormat.test(url)) {
        requestOptions.key = url.match(sheetType.keyFormat)[1];
        requestOptions.gid = url.match(sheetType.gidFormat)[1];
        requestOptions.apiEndpoint = sheetType.apiEndpoint.replace('%key%', requestOptions.key);
        return false;
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
  var arrayToObject = function (arr) {
    var obj = {};
    $.each(arr, function (i, str) {
      obj[str] = str;
    });
    return obj;
  };

  // Wrap a string in tag. The style argument, if present, is populated into
  // an inline CSS style attribute. (Gross!)
  var wrapTag = function (str, tag) {
    return '<' + tag + '>' + str + '</' + tag + '>';
  };

  // Default row handler: Output a row object as an HTML table row.
  var toHTML = function (row) {

    var cell;
    var html = '';

    // Use "td" for table body row, "th" for table header rows.
    var tag = (row.num) ? 'td' : 'th';

    // Loop through each cell in the row.
    for (cell in row.cells) {
      if (row.cells.hasOwnProperty(cell)) {
        // Wrap the cell value in the cell tag.
        html += wrapTag(row.cells[cell], tag);
      }
    }

    // Wrap the cells in a table row tag.
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

  // Validate processed user options.
  var validateUserOptions = function (options) {

    // Require `this` or a callback function. Otherwise, the data has nowhere to go.
    if (!options.target.length && options.user.callback === $.noop) {
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
  var loadDefaultUserOptions = function (options) {

    options = $.extend({}, $.fn.sheetrock.defaults, options);

    // Support some legacy option names.
    options.query = options.sql || options.query;
    options.reset = options.resetStatus || options.reset;
    options.callback = options.userCallback || options.callback;

    // Validate integer values.
    options.headers = stringToNaturalNumber(options.headers);
    options.chunkSize = stringToNaturalNumber(options.chunkSize);

    return options;

  };

  // Process user-passed options.
  var processUserOptions = function (target, options) {

    var userOptions = loadDefaultUserOptions(options);
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

    return validateUserOptions({
      user: userOptions,
      request: requestOptions,
      target: target
    });

  };

  // Get useful information about the response.
  var getResponseAttributes = function (options, data) {

    // Initialize a hash for parsed options.
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
    attributes.last = (chunkSize) ? Math.min(rows.length, chunkSize) : rows.length;

    // Remember whether this request has been fully loaded.
    requestStatusCache.loaded[options.request.index] = !chunkSize || attributes.last < chunkSize;

    // Determine if Google has extracted column labels from a header row.
    attributes.header = ($.map(cols, getColumnLabel).length) ? 1 : 0;

    // If no column labels are provided or if there are too many or too few
    // compared to the returned data, use the returned column labels.
    attributes.labels = (labels && labels.length === cols.length) ? labels : $.map(cols, getColumnLabelOrLetter);

    // Return extended options.
    return attributes;

  };


  /* Data */

  // Enumerate any messages embedded in the API response.
  var enumerateMessages = function (data, state) {

    // Look for the specified property at the root of the response object.
    if (has(data, state)) {

      // Look for the kinds of messages we know about.
      $.each(data[state], function (i, status) {
        if (has(status, 'detailed_message')) {
          /* jshint camelcase: false */
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          log(status.detailed_message);
          // jscs:enable
        } else if (has(status, 'message')) {
          log(status.message);
        }
      });

    }

  };

  // Parse data, row by row.
  var parseData = function (options, data) {

    var isTable = (options.target.prop('tagName') === 'TABLE');
    var headerTarget = options.target;
    var bodyTarget = options.target;

    // Add row group tags (<thead>, <tbody>) if the target is a table.
    if (isTable) {
      headerTarget = $('<thead/>').appendTo(options.target);
      bodyTarget = $('<tbody/>').appendTo(options.target);
    }

    // Output a header row, if needed.
    if (!options.user.offset && !options.user.headersOff) {
      if (options.response.header || !options.user.headers) {
        headerTarget.append(options.user.rowHandler({
          num: 0,
          cells: arrayToObject(options.response.labels)
        }));
      }
    }

    // Each table cell ('c') can contain two properties: 'p' contains
    // formatting and 'v' contains the actual cell value.

    // Loop through each table row.
    $.each(data.table.rows, function (i, obj) {

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
          $.each(obj.c, function (x, cell) {

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
            // Append to table body.
            bodyTarget.append(options.user.rowHandler(rowObject));
          } else {
            // Append to table header.
            headerTarget.append(options.user.rowHandler(rowObject));
          }

        }

      }

    });

  };

  // Process API response.
  var processResponse = function (options, data) {

    enumerateMessages(data, 'warnings');
    enumerateMessages(data, 'errors');

    log(data, options.user.debug);

    // Make sure the response is populated with actual data.
    if (has(data, 'status', 'table') && has(data.table, 'cols', 'rows')) {

      // Extend the options hash with useful information about the response.
      options.response = getResponseAttributes(options, data);

      // If there is an element being targeted, parse the data into HTML.
      if (options.target.length) {
        parseData(options, data);
      }

      // Call the user's callback function.
      options.user.callback(options, data);

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
    $.ajax(request)
      .done(createClosure(processResponse, options))
      .fail(createClosure(handleError, options));

  };


  /* Main */

  var sheetrock = function (target, options, bootstrappedData) {

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

  $.fn.sheetrock = function (options, bootstrappedData) {
    try {
      sheetrock(this, options, bootstrappedData);
    } catch (err) {
      log(err);
    } finally {
      return this;
    }
  };

  $.fn.sheetrock.version = '0.3.0';

  // Changes in 1.0.0:
  // -----------------
  // - *renamed* .options => .defaults
  // - *removed* .promise -- requests are no longer chained
  // - *removed* .working -- use callback function

  // Todo:
  // -----
  // - rename chunkSize
  // - remove/merge labels option?
  // - remove/merge header options?

  $.fn.sheetrock.defaults = {

    // Changes in 1.0.0:
    // -----------------
    // - *renamed* sql => query
    // - *renamed* resetStatus => reset
    // - *removed* server -- pass data as parameter instead
    // - *removed* columns -- always use column letters in query
    // - *removed* cellHandler -- use rowHandler for text formatting
    // - *removed* loading -- use callback function
    // - *removed* rowGroups -- <thead>, <tbody> added when target is <table>
    // - *removed* formatting -- almost useless, impossible to support

    url:          '',          // String  -- Google Sheet URL
    query:        '',          // String  -- Google Visualization API query
    chunkSize:    0,           // Integer -- Number of rows to fetch (0 = all)
    labels:       [],          // Array   -- Override *returned* column labels
    rowHandler:   toHTML,      // Function
    errorHandler: $.noop,      // Function
    callback:     $.noop,      // Function
    headers:      0,           // Integer -- Number of header rows
    headersOff:   false,       // Boolean -- Suppress header row output
    reset:        false,       // Boolean -- Reset request status
    debug:        false        // Boolean -- Output raw data to the console

  };

  return $.fn.sheetrock;

}));
