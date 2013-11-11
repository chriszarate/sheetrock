/*
 * jQuery Sheetrock v0.1.6
 * Quickly connect to, query, and lazy-load data from Google Spreadsheets
 * Requires jQuery >=1.6
 * http://github.com/chriszarate/sheetrock
 */

;(function(sheetrock) {

  "use strict";

  /*
    AMD support
    Since we are simply modifying the jQuery object, there is no need to
    use a require statement to load this plugin.
  */

  if(typeof define === 'function' && define.amd) {
    define('jquery.sheetrock', ['jquery'], sheetrock);
  } else {
    sheetrock(window.jQuery);
  }

})(function($) {

  "use strict";

  $.fn.sheetrock = function(options, data) {

    // Store reference to `this`.
    options.target = this;

    // Load and validate options.
    options = _options(options);

    // Proceed if options are valid.
    if(options) {

      // Check for bootstrapped data.
      if(_def(data) && data !== null) {

        // Process bootstrapped data.
        _data(options, data);

      } else {

        // Process request for external data.
        _init(options);

      }

    }

    // Return `this` to allow jQuery object chaining.
    return this;

  };


  /* Setup */

  // Placeholder for column labels
  var _columns = {},

  // Callback function index
  _callbackIndex = 0,

  // Data labels
  _error  = 'sheetrockError',
  _loaded = 'sheetrockLoaded',
  _offset = 'sheetrockRowOffset',


  /* Task runners */

  // Initiate request to Google Spreadsheets API.
  _init = function(options) {

    // Chain off of previous promise.
    $.fn.sheetrock.promise = $.fn.sheetrock.promise

      // Prefetch column labels (if necessary).
      .pipe(function() {
        return _prefetch(options);
      })

      // Fetch request.
      .pipe(function() {
        return _fetch(options);
      });

  },

  // Load bootstrapped data (no request to API).
  _data = function(options, data) {

    // Spin up user-facing indicators.
    _begin(options);

    // Validate and load data.
    _validate.call(options, data);

    // Wind down user-facing indicators.
    _always.call(options);

  },


  /* Data fetchers */

  // Prefetch column labels (if necessary).
  _prefetch = function(options) {

    // Options for prefetching column labels
    var prefetch = {
      sql: 'select * limit 1',
      dataHandler: _columns_hash,
      userCallback: $.noop,
      target: false
    };

    // Proceed if column labels are not present (either in the SQL query via
    // the '%label%' technique or in the passed options).
    if(options.sql.indexOf('%') !== -1 && !_get_columns(options)) {

      // Make a special request for just the column labels.
      _log('Prefetching column labels.');
      return _fetch($.extend({}, options, prefetch));

    } else {

      // Return a resolved deferred object so that the next request fires
      // immediately.
      return $.Deferred().resolve();

    }

  },

  // Fetch the requested data using the user's options.
  _fetch = function(options) {

    // Spin up user-facing indicators.
    _begin(options);

    // If requested, make a request for chunked data.
    if(options.chunkSize && options.target) {

      // Append a limit and row offest to the query to target the next chunk.
      options.sql += ' limit ' + (options.chunkSize + 1) + ' offset ' + options.offset;

      // Store the new row offset on the target element using jQuery.data.
      _put(options.target, _offset, options.offset + options.chunkSize);

    }

    // Specify a custom callback function since Google doesn't use the
    // default implementation favored by jQuery.
    options.callback = 'sheetrock_callback_' + _callbackIndex++;

    // AJAX request options
    var request = {

      // Convert user options into AJAX request parameters.
      data: _params(options),

      // Use user options object as context (`this`) for data handler.
      context: options,

      url: $.fn.sheetrock.server,
      dataType: 'jsonp',
      cache: true,

      // Use custom callback function (see above).
      jsonp: false,
      jsonpCallback: options.callback

    };

    // If debugging is enabled, log details to console.
    _log(request, options.debug);

    // Send the request.
    return $.ajax(request)

      // Not sure this is necessary.
      .promise()

      // Validate the response data.
      .done(_validate)

      // Handle errors.
      .fail(_fail)

      // Wind down user-facing indicators.
      .always(_always);

  },

  // Convert user options into AJAX request parameters.
  _params = function(options) {

    // Create new paramters object.
    var params = {

      // Google Spreadsheet identifiers
      key: options.key,
      gid: options.gid,

      // Conform to Google's nonstandard callback syntax.
      tqx: 'responseHandler:' + options.callback

    };

    // Optional SQL query
    if(options.sql) {
      // Swap column labels for column letters.
      params.tq = _swap(options.sql, _get_columns(options));
    }

    return params;

  },


  /* UI and AJAX helpers. */

  // Spin up user-facing indicators.
  _begin = function(options) {

    // Show loading indicator.
    options.loading.show();

    // Increment the `working` flag.
    $.fn.sheetrock.working++;

  },

  // Wind down user-facing indicators.
  _always = function() {

    // Hide the loading indicator.
    this.loading.hide();

    // Call the user's callback function.
    this.userCallback(this);

    // Decrement the `working` flag.
    $.fn.sheetrock.working--;

  },

  // Generic error handler for AJAX errors.
  _fail = function() {

    // Store an error flag on the target element using jQuery.data.
    _put(this.target, _error, 1);

    // Log the error to the console.
    _log('Request failed.');

  },

  // Enumerate any messages embedded in the API response.
  _enumerate = function(data, state) {

    // Look for the specified property at the root of the response object.
    if(_has(data, state)) {

      // Look for the kinds of messages we know about.
      $.each(data[state], function(i, status) {
        if(_has(status, 'detailed_message')) {
          _log(status.detailed_message);
        } else if(_has(status, 'message')) {
          _log(status.message);
        }
      });

    }

  },


  /* Data validators */

  // Validate API response.
  _validate = function(data) {

    // Enumerate any returned warning messages.
    _enumerate(data, 'warnings');

    // Enumerate any returned error messages.
    _enumerate(data, 'errors');

    // Log the API response to the console, if requested.
    _log(data, this.debug);

    // Make sure the response is populated with actual data.
    if(_has(data, 'status', 'table') && _has(data.table, 'cols', 'rows')) {

      // Extend the options hash with useful information about the response.
      var parsedOptions = _extend.call(this, data);

      // Pass the API response to the data handler.
      this.dataHandler.call(parsedOptions, data);

    } else {

      // The response seems empty; call the error handler.
      _fail.call(this, data);

    }

  },

  // Extend the options hash with useful information about the response.
  _extend = function(data) {

    // Store reference to the options hash.
    var options = this;

    // Initialize a hash for parsed options.
    options.parsed = {};

    // The Google API generates an unrecoverable error when the 'offset' is
    // larger than the number of available rows, which is problematic for
    // chunked requests. As a workaround, we request one more row than we need
    // and stop when we see less rows than we requested.

    // Calculate the last returned row.
    options.parsed.last = (options.chunkSize) ? Math.min(data.table.rows.length, options.chunkSize) : data.table.rows.length;

    // The request is fully loaded when the last returned row is smaller than
    // the chunk size.
    options.parsed.loaded = (!options.chunkSize || options.parsed.last < options.chunkSize) ? 1 : 0;

    // Store the loaded status on the target element using jQuery.data.
    _put(options.target, _loaded, options.parsed.loaded);

    // Determine if Google has extracted column labels from a header row.
    options.parsed.header = ($.map(data.table.cols, _map_label).length) ? 1 : 0;

    // If no column labels are provided or if there are too many or too few
    // compared to the returned data, use the returned column labels.
    options.parsed.labels = (options.labels && options.labels.length === data.table.cols.length) ? options.labels : $.map(data.table.cols, _map_label_letter);

    // Return extended options.
    return options;

  },


  /* Data parsers */

  // Parse data, row by row.
  _parse = function(data) {

    // Store reference to the options hash and target.
    var options = this,
        target = options.target;

    // Add row group tags (<thead>, <tbody>), if requested.
    $.extend(options, {
      thead: (options.rowGroups) ? $('<thead/>').appendTo(target) : target,
      tbody: (options.rowGroups) ? $('<tbody/>').appendTo(target) : target
    });

    // Output a header row, if needed.
    if(!options.offset && !options.headersOff) {
      if(options.parsed.header || !options.headers) {
        options.thead.append(options.rowHandler({
          num: 0,
          cells: _arr_to_obj(options.parsed.labels)
        }));
      }
    }

    // Each table cell ('c') can contain two properties: 'p' contains
    // formatting and 'v' contains the actual cell value.

    // Loop through each table row.
    $.each(data.table.rows, function(i, obj) {

      // Proceed if the row has cells and the row index is within the targeted
      // range. (This avoids displaying too many rows when chunking data.)
      if(_has(obj, 'c') && i < options.parsed.last) {

        // Get the "real" row index (not counting header rows).
        var counter = _nat(options.offset + i + 1 + options.parsed.header - options.headers),

        // Initialize a row object, which will be passed to the row handler.
        objData = {num: counter, cells: {}};

        // Suppress header row, if requested.
        if(counter || !options.headersOff) {

          // Loop through each cell in the row.
          $.each(obj.c, function(x, cell) {

            // Process cell formatting, if requested.
            var style = (options.formatting) ? _style(cell) : false,

            // Process cell value with cell handler function.
            value = (cell && _has(cell, 'v')) ? options.cellHandler(cell.v) : '';

            // Add the cell to the row object, using the desired column label
            // as the key.
            objData.cells[options.parsed.labels[x]] = (style) ? _wrap(value, 'span', style) : value;

          });

          // Pass the row object to the row handler and append the output to
          // the target element.

          if(objData.num) {
            // Append to table body.
            options.tbody.append(options.rowHandler(objData));
          } else {
            // Append to table header.
            options.thead.append(options.rowHandler(objData));
          }

        }

      }

    });

  },

  // Cache column labels (indexed by key+gid) in the plugin scope. This way
  // column labels will only be prefetched once.
  _columns_hash = function(data) {
    var hash = {};
    $.each(data.table.cols, function(i, col) {
      hash[col.id] = _map_label_letter(col);
    });
    _columns[this.key + this.gid] = hash;
  },

  // Look for acceptable column labels first in the passed options, then in
  // the column label cache. Fallback to `false`, which triggers a prefetch.
  _get_columns = function(options) {
    if($.isEmptyObject(options.columns)) {
      return _columns[options.key + options.gid] || false;
    } else {
      return options.columns;
    }
  },


  /* User input validator */

  // Validate user-passed options.
  _options = function(options) {

    // Extend default options.
    options = $.extend({}, $.fn.sheetrock.options, options);

    // Get spreadsheet key and gid.
    options.key = _key(options.url);
    options.gid = _gid(options.url);

    // Validate chunk size and header rows.
    options.chunkSize = (options.target.length) ? _nat(options.chunkSize) : 0;
    options.headers = _nat(options.headers);

    // Retrieve current row offset.
    options.offset = (options.chunkSize) ? _get(options.target, _offset) : 0;

    // Make sure `loading` is a jQuery object.
    options.loading = _val_jquery(options.loading);

    // Require `this` or a data handler. Otherwise, the data has nowhere to go.
    if(!options.target.length && options.dataHandler === _parse) {
      return _log('No element targeted or data handler provided.');
    // Abandon requests that have already been loaded.
    } else if(_get(options.target, _loaded)) {
      return _log('No more rows to load!');
    // Abandon requests that have previously generated an error.
    } else if(_get(options.target, _error)) {
      return _log('A previous request for this resource failed.');
    // Require a spreadsheet URL.
    } else if(!options.url) {
      return _log('No spreadsheet URL provided.');
    // Require a spreadsheet key.
    } else if(!options.key) {
      return _log('Could not find a key in the provided URL.');
    // Require a spreadsheet gid.
    } else if(!options.gid) {
      return _log('Could not find a gid in the provided URL.');
    }

    // Log the validated options to the console, if requested.
    _log(options, options.debug);

    return options;

  },


  /* Miscellaneous functions */

  // Trim a string of spaces.
  _trim = function(str) {
    return str.toString().replace(/^ +/, '').replace(/ +$/, '');
  },

  // Parse a string as a natural number (>=0).
  _nat = function(str) {
    return Math.max(0, parseInt(str, 10) || 0);
  },

  // Return true if an object has a property. Accepts multiple properties.
  // _has(obj, 'prop1', 'prop2', [...])
  _has = function(obj) {
    for(var i = 1; i < arguments.length; i++) {
      if(!_def(obj[arguments[i]])) {
        return false;
      }
    }
    return true;
  },

  // Return true if variable is defined.
  _def = function(def) {
    return (typeof def === 'undefined') ? false : true;
  },

  // Log something to the browser console, if it exists. The argument "show"
  // is a Boolean (default = true) that determines whether to proceed.
  _log = function(msg, show) {
    show = (_def(show)) ? show : true;
    if(show && window.console && console.log) {
      console.log(msg);
    }
    return false;
  },

  // Retrieve data from a DOM element using jQuery.data.
  _get = function(el, key) {
    return (el.length) ? $.data(el[0], key) || 0 : 0;
  },

  // Store data on a DOM element using jQuery.data.
  _put = function(el, key, val) {
    return (el.length) ? $.data(el[0], key, val) || 0 : 0;
  },

  // Extract the "key" from a Google Spreadsheet URL.
  _key = function(url) {
    var keyRegExp = new RegExp('key=([^&#]+)','i');
    return (keyRegExp.test(url)) ? url.match(keyRegExp)[1] : false;
  },

  // Extract the "gid" from a Google spreadsheet URL.
  _gid = function(url) {
    var gidRegExp = new RegExp('gid=([^&#]+)','i');
    return (gidRegExp.test(url)) ? url.match(gidRegExp)[1] : false;
  },

  // Extract the label, if present, from a column object, sans white space.
  _label = function(col) {
    return (_has(col, 'label')) ? col.label.replace(/\s/g, '') : false;
  },

  // Map function: Return the label of a column object.
  _map_label = function(col) {
    return _label(col) || null;
  },

  // Map function: Return the label or letter of a column object.
  _map_label_letter = function(col) {
    return _label(col) || col.id;
  },

  // Swap user-provided column labels (%label%) with column letters.
  _swap = function(sql, columns) {
    $.each(columns, function(key, val) {
      sql = sql.replace(new RegExp('%' + val + '%', 'g'), key);
    });
    return sql;
  },

  // Return true if the reference is a valid jQuery object or selector.
  _val_jquery = function(ref) {
    return (ref && !(ref instanceof $)) ? $(ref) : ref;
  },

  // Convert an array to a object.
  _arr_to_obj = function(arr) {
    var obj = {};
    $.each(arr, function(i, str) { obj[str] = str; });
    return obj;
  },

  // Extract formatting from a Google spreadsheet cell.
  _style = function(cell) {
    return (cell && _has(cell, 'p') && _has(cell.p, 'style')) ? cell.p.style : false;
  },

  // Default row handler: Output a row object as an HTML table row.
  _output = function(row) {

    // Placeholders
    var prop, html = '',

    // Use "td" for table body row, "th" for table header rows.
    tag = (row.num) ? 'td' : 'th';

    // Loop through each cell in the row.
    for(prop in row.cells) {

      // Make sure `prop` is a real object property.
      if(_has(row.cells, prop)) {
        // Wrap the cell value in the cell tag.
        html += _wrap(row.cells[prop], tag, '');
      }

    }

    // Wrap the cells in a table row tag.
    return _wrap(html, 'tr', '');

  },

  // Wrap a string in tag. The style argument, if present, is populated into
  // an inline CSS style attribute. (Gross!)
  _wrap = function(str, tag, style) {
    var attr = (style) ? ' style="' + style + '"' : '';
    return '<' + tag + attr + '>' + str + '</' + tag + '>';
  };


  /* Default options */

  $.fn.sheetrock.options = {

    // Documentation is available at:
    // http://chriszarate.github.io/sheetrock

    url:          '',       // String  -- Google spreadsheet URL
    sql:          '',       // String  -- Google Visualization API query
    chunkSize:    0,        // Integer -- Number of rows to fetch (0 = all)
    columns:      {},       // Object  -- Hash of column letters and labels
    labels:       [],       // Array   -- Override *returned* column labels
    rowHandler:   _output,  // Function
    cellHandler:  _trim,    // Function
    dataHandler:  _parse,   // Function
    userCallback: $.noop,   // Function
    loading:      $(),      // jQuery object or selector
    debug:        false,    // Boolean -- Output raw data to the console
    headers:      0,        // Integer -- Number of header rows
    headersOff:   false,    // Boolean -- Suppress header row output
    rowGroups:    false,    // Boolean -- Output <thead> and <tbody> tags
    formatting:   false     // Boolean -- Include Google HTML formatting

  };

  // Google API endpoint.
  $.fn.sheetrock.server = 'https://spreadsheets.google.com/tq';

  // This property is set to the number of active requests. This can be useful
  // for user monitoring or for infinite scroll bindings.
  $.fn.sheetrock.working = 0;

  // This property contains a jQuery promise for the most recent request. If
  // you chain off of this, be sure to return another jQuery promise so
  // Sheetrock can continue to chain off of it.
  $.fn.sheetrock.promise = $.Deferred().resolve();

  // Version number.
  $.fn.sheetrock.version = '0.1.6';

});
