/*
 * jQuery Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Spreadsheets
 * http://github.com/chriszarate/Sheetrock
 */

;(function($) {

  "use strict";

  $.fn.sheetrock = function(options) {

    // Load and validate options.
    options = _options($.extend({}, $.fn.sheetrock.options, options, _isth(this)));

    // Fetch data.
    _fetch(options);

    // Allow chaining.
    return this;

  };


  /* Setup */

  // Callback index
  var _callbackIndex = 0,

  // Data labels
  _error  = 'sheetrock-error',
  _loaded = 'sheetrock-loaded',
  _offset = 'sheetrock-row-offset',


  /* Fetch */

  // Send request with prevalidated options.
  _fetch = function(options) {

    // Abort if options are not valid.
    if(!options) {
      return false;
    }

    // Load queued options.
    if(_has(options, 'queued')) {
      options = options.queued;
    }

    // Queue cached options.
    if(_has(options, 'cached')) {
      options.queued = options.cached;
    }

    // Show loading indicator.
    if(options.loading) {
      options.loading.show();
    }

    // Enable chunking, if requested, and store offset as jQuery.data.
    if(options.chunkSize && options.target) {
      options.sql += ' limit ' + (options.chunkSize + 1) + ' offset ' + options.offset;
      _put(options.target, _offset, options.offset + options.chunkSize);
    }

    // Create callback environment and turn on `working` flag.
    options.callback = 'sheetrock_' + _callbackIndex++;
    $.fn.sheetrock.working++;

    // Create AJAX request parameters from config options.
    var params = _params(options);

    // Send request.
    $.ajax({

      data: params,
      context: options,
      url: 'https://spreadsheets.google.com/tq',

      dataType: 'jsonp',
      cache: true,
      jsonp: false,
      jsonpCallback: options.callback,

      success: function(data) {

        // IF valid THEN process ELSE error.
        if(_validate(data)) {
          this.dataHandler(data, this);
        } else {
          _put(this.target, _error, 1);
          return _log('Returned data failed validation.');
        }

        // Clean up.
        if(this.loading) {
          this.loading.hide();
        }
        if(this.userCallback) {
          this.userCallback(this);
        }
        $.fn.sheetrock.working--;

      }

    });

  },


  /* Data parsing */

  // Validate returned data.
  _validate = function(data) {

    // Check for successful response types.
    if(_has(data, 'status') && (data.status === 'ok' || data.status === 'warning') && _has(data, 'table')) {

      // Enumerate any warnings.
      if(_has(data, 'warnings')) {
        $.each(data.warnings, function(i, warning) { _log(warning); });
      }

      return true;

    } else {

      // Enumerate any errors.
      if(_has(data, 'errors')) {
        $.each(data.errors, function(i, error) {
          _log(error.message);
          _log(error.detailed_message);
        });
      }

      return false;

    }

  },

  // Parse data, row by row.
  _parse = function(data, options) {

    // Debug returned data
    if(options.debug) {
      _log(data);
    }

    // The Google API generates an unrecoverable error when the 'offset' 
    // is larger than the number of available rows. As a workaround, we 
    // request one more row than we need and stop when we see less rows 
    // than we requested.

    var last   = (options.chunkSize) ? Math.min(data.table.rows.length, options.chunkSize) : data.table.rows.length,
        loaded = (!options.chunkSize || last < options.chunkSize) ? 1 : 0,

        // Determine if Google has extracted column labels from a header row.
        header = ($.map(data.table.cols, _header).length) ? 1 : 0,

        // If no column labels are provided (or if there are too many or too 
        // few), use the returned column labels.
        labels = (options.labels && options.labels.length === data.table.cols.length) ? options.labels : $.map(data.table.cols, _labels);

    // Store loaded status on target element.
    _put(options.target, _loaded, loaded);

    // Output a header row if needed.
    if(!options.offset && !options.headersOff) {
      if(header || !options.headers) {
        options.target.append(options.rowHandler({
          num: 0,
          cells: _obj(labels)
        }));
      }
    }

    // Each table cell ('c') can contain two properties: 'p' contains 
    // formatting and 'v' contains the actual cell value.

    $.each(data.table.rows, function(i, obj) {

      if(_has(obj, 'c') && i < last) {

        var counter = _nat(options.offset + i + 1 + header - options.headers),
            objData = {num: counter, cells: {}};

        // Suppress header row if requested.
        if(counter || !options.headersOff) {

          $.each(obj.c, function(x, cell) {
            var style = (options.formatting) ? _style(cell) : false,
                value = (cell && _has(cell, 'v')) ? options.cellHandler(cell.v) : '';
            objData.cells[labels[x]] = (style) ? _wrap(value, 'span', style) : value;
          });

          // Pass to row handler and append to target.
          options.target.append(options.rowHandler(objData));

        }

      }

    });

  },

  // Get and store all column labels.
  _cols = function(data) {
    $.each(data.table.cols, function(i, col) {
      $.fn.sheetrock.labels[col.id] = (_has(col, 'label')) ? col.label.replace(/ /g, '') : col.id;
    });
    return true;
  },


  /* Validation and assembly */

  // Validate user-passed options.
  _options = function(options) {

    // Get spreadsheet key and gid.
    options.key = _key(options.url);
    options.gid = _gid(options.url);

    // Validate chunk size and header rows.
    options.chunkSize = (options.target) ? _nat(options.chunkSize) : 0;
    options.headers = _nat(options.headers);

    // Calculate offset.
    options.offset = (options.chunkSize) ? _get(options.target, _offset) : 0;

    // Make sure `loading` is a jQuery object.
    options.loading = _jqval(options.loading);

    // Require `this` or a handler to receive the data.
    if(!options.target && options.dataHandler === _parse) {
      return _log('No element targeted or data handler provided.');
    // Abandon already-completed requests.
    } else if(_get(options.target, _loaded)) {
      return _log('No more rows to load!');
    // Abandon error-generating requests.
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
    // Fetch column labels if they are needed.
    } else if(options.sql && $.isEmptyObject($.fn.sheetrock.labels)) {
      _log('Fetching column labels.');
      options = $.extend({}, options, {sql: '', chunkSize: 1, offset: 0, loading: options.loading, target: false, dataHandler: _cols, userCallback: _fetch, cached: options});
    }

    // Debug options.
    if(options.debug) {
      _log(options);
    }

    return options;

  },

  // Create AJAX request paramater object.
  _params = function(options) {

    var params = {
      key: options.key,
      gid: options.gid,
      tqx: 'responseHandler:' + options.callback
    };

    // Optional SQL request.
    if(options.sql) {
      params.tq = _swap(options.sql);
    }

    return params;
 
  },


  /* Miscellaneous functions */

  // Trim string.
  _trim = function(str) {
    return str.toString().replace(/^ +/, '').replace(/ +$/, '');
  },

  // Parse as natural number (>=0).
  _nat = function(str) {
    return Math.max(0, parseInt(str, 10) || 0);
  },

  // Shorthand object property lookup.
  _has = function(obj, prop) {
    return (typeof obj[prop] === 'undefined') ? false : true;
  },

  // Shorthand log to console.
  _log = function(msg) {
    if(window.console && console.log) {
      console.log(msg);
    }
    return false;
  },

  // Validate `this` for options hash.
  _isth = function(el) {
    var target = (el.length) ? el : false;
    return {target: target};
  },

  // Validate jQuery object or selector.
  _jqval = function(ref) {
    return (ref && !(ref instanceof jQuery)) ? $(ref) : ref;
  },

  // Shorthand data retrieval.
  _get = function(el, key) {
    return (el) ? _nat($.data(el[0], key)) : 0;
  },

  // Shorthand data storage.
  _put = function(el, key, val) {
    return (el) ? $.data(el[0], key, val) : 0;
  },

  // Extract the key from a spreadsheet URL.
  _key = function(url) {
    var keyRegExp = new RegExp('key=([a-z0-9]{30,})&?','i');
    return (keyRegExp.test(url)) ? url.match(keyRegExp)[1] : false;
  },

  // Extract the gid from a spreadsheet URL.
  _gid = function(url) {
    var gidRegExp = new RegExp('gid=([0-9]+)','i');
    return (gidRegExp.test(url)) ? url.match(gidRegExp)[1] : false;
  },

  // Determine if the a header row has been populated into column labels.
  _header = function(col) {
    return _label(col) || null;
  },

  // Get column labels or letters from returned data.
  _labels = function(col) {
    return _label(col) || col.id;
  },

  // Extract valid label from column, if it exists.
  _label = function(col) {
    return (_has(col, 'label')) ? col.label.replace(/\s/g, '') : false;
  },

  // Swap column %labels% with column letters.
  _swap = function(sql) {
    $.each($.fn.sheetrock.labels, function(key, val) {
      sql = sql.replace(new RegExp('%' + val + '%', 'g'), key);
    });
    return sql;
  },

  // Convert array to object.
  _obj = function(arr) {
    var obj = {};
    $.each(arr, function(i, str) { obj[str] = str; });
    return obj;
  },

  // Extract formatting from a Google spreadsheet cell.
  _style = function(cell) {
    return (cell && _has(cell, 'p') && _has(cell.p, 'style')) ? cell.p.style : false;
  },

  // Output object to HTML (default row handler).
  _output = function(row) {
    var prop, str = '', tag = (row.num) ? 'td' : 'th';
    for(prop in row.cells) {
      if(_has(row.cells, prop)) {
        str += _wrap(row.cells[prop], tag, '');
      }
    }
    return _wrap(str, 'tr', '');
  },

  // Wrap string in tag.
  _wrap = function(str, tag, style) {
    var attr = (style) ? ' style="' + style + '"' : '';
    return '<' + tag + attr + '>' + str + '</' + tag + '>';
  };


  /* Default options */

  $.fn.sheetrock.options = {

    // You must provide, at minimum, the `url` of your spreadsheet. 
    // Everything else is optional! Defaults can be overridden either 
    // globally ($.fn.sheetrock.key = value) or per-call using the 
    // passed options object.

    url:        '',     // String  -- Google spreadsheet URL

    headers:    0,      // Integer -- Number of header rows
    headersOff: false,  // Boolean -- Suppress header row output

    labels:     [],     // Array   -- Override returned column labels
    formatting: false,  // Boolean -- Include Google HTML formatting
    chunkSize:  0,      // Integer -- Number of rows to fetch (0 = all)
    debug:      false,  // Boolean -- Output raw data to the console

    // By default, Google only allows column letters (e.g., A, B) in 
    // visualization SQL queries. If you prefer, you can use column labels 
    // in your SQL query and they will be swapped out with the 
    // corresponding column letters. Wrap column labels in percent signs,
    // e.g., "select %name%,%age% where %age% > 21".

    sql: '',  // String  -- Google Visualization API query (SQL-like)

    // Providing a row handler is the recommended way to override the 
    // default data formatting. This function should accept a row object 
    // and a row number (header = 0, first data row = 1). The properties 
    // of this object will be named after its column labels. Your function 
    // should return content (a DOM/jQuery object or an HTML string) that 
    // is ready to be appended to your target element. A very easy way to 
    // do this is to provide an Underscore.js template (which is itself a 
    // function).

    rowHandler: _output,  // Function

    // This function is used to process every cell value. It should return 
    // a string. The provided default is a simple trim function.

    cellHandler: _trim,  // Function

    // Providing your own data handler means you don't want any processing 
    // to take place except for basic validation. The returned data, if 
    // valid, is passed to your data handler (along with an options hash) 
    // and it will be completely up to you to do something with it. The 
    // cell handler and row handler functions will not be called.

    dataHandler: _parse,  // Function

    // You can provide a function to be called when all processing is 
    // complete. The options hash is passed to this function.

    userCallback: false,  // Function

    // If you have a loading indicator in your page, provide a jQuery object 
    // or selector here. It will be shown when the request starts and hidden 
    // when it ends.

    loading: false  // jQuery object or selector

  };

  // This is a placeholder for all the column labels, if they are needed.

  $.fn.sheetrock.labels = {};

  // This property is set to the number of active requests. This can be useful 
  // for monitoring or for infinite scroll bindings.

  $.fn.sheetrock.working = 0;

})(jQuery);
