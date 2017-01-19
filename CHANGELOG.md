## Change Log

### v1.1.4

* Allow default callback to be overridden. (#113).


### v1.1.3

* Don't catch errors thrown in user template (#111).


### v1.1.2

* Fix by @papoms for requests that fail after use of reset option (#104).


### v1.1.1

* Fix error when parsing null cell values (fixes #101).
* Better error handling of invalid URLs.


### v1.1.0

* Rewritten in ES2015.
* Changes to API:
  - removed non-authoritative `.environment`
* Standard UMD provided by Webpack.


### v1.0.1

* Webpack support.
* Use formatted numbers (percentages, x decimal places) when available. (@niceandserious)
* Smaller minified dist version.


### v1.0.0

* No longer depends on jQuery
* Use in browser or on server (with or without virtual DOM)
* Module renamed from jquery-sheetrock to sheetrock
* Now expects a single header row in row 1
* Passes consistent row numbers to the row template, starting at `1`
* Changes to API:
  - added `.environment` to expose detected features to user
  - renamed `.options` to `.defaults`
  - removed `.promise` (requests are no longer chained)
  - removed `.working` (use callback function to determine request status)
* Changes to defaults:
  - added `target` as alternative to jQuery's `this`
  - renamed `sql` to `query`
  - renamed `chunkSize` to `fetchSize`
  - renamed `resetStatus` to `reset`
  - renamed `rowHandler` to `rowTemplate`
  - renamed `userCallback` to `callback` (but passes different paramaters)
  - removed `server` (pass bootstrapped data instead)
  - removed `columns` (always use column letters in query)
  - removed `cellHandler` (use rowTemplate for text formatting)
  - removed `errorHandler` (errors are passed to callback function)
  - removed `loading` (use callback function to manipulate UI)
  - removed `rowGroups` (`&lt;thead&gt;` and `&lt;tbody&gt;` are added when
    `target` is a `&lt;table&gt;`)
  - removed `formatting` (almost useless, impossible to support)
  - removed `headers` (multiple header rows cause myriad problems)
  - removed `headersOff` (use rowTemplate to show or hide rows)
  - removed `debug` (compiled messages are passed to callback function)


### v0.3.0

* Published as NPM module (can be required and Browserified).
* Better loading default prevents option being set to empty string.


### v0.2.4

* Avoid reserved keyword "new" to satisfy YUI compressor.


### v0.2.3

* CommonJS support.
* Move minified files to /dist.
* Load Prism JS and CSS from CloudFlare's CDN.


### v0.2.2

* Improved error handling and provide failure tests.


### v0.2.1

* Handle null cell values (#37).


### v0.2.0

* Compatibility with the new version of Google Spreadsheets! (#33)
* Add `errorHandler` option to allow user to do something with AJAX errors.
* Simple tests using QUnit.


### v0.1.10

* Update key extraction to work with the new version of Google Spreadsheets
  (see #31).
* Add note about (hopefully temporary) incompatibility with the new version of
  Google Spreadsheets (see #31).

### v0.1.9

* Avoid array-like cell values (see #23).

### v0.1.8

* Moved caching of row offset to options validation function (see #18).

### v0.1.7

* Added change log.
* Move plugin code into `src` subfolder.
* New `resetStatus` option resets the row offest, loaded, and error indicators
  on a per-unique-request basis. This is useful if you want to reload data,
  retry after an error, or load data in another context.
* Row offest, loaded, and error indicators were previously stored as data
  attributes on the target DOM element. This created an undesirable 1:1
  correspondence between requests and DOM elements. These indicators are now
  stored internally and indexed per unique request. They can be reset using
  the `resetStatus` option.
* Default for `rowGroups` options is now `true`. When using the default row
  handler, table tags `&lt;thead&gt;` and `&lt;tbody&gt;` are used by default.
* Moved `server` option from public property (`$.fn.sheetrock.server`) to
  undocumented option. This allows per-request configuration of the Google API
  endpoint.
* Public property `$.fn.sheetrock.working` is now Boolean, since there can
  only be one AJAX request at a time.
* Consolidate documentation in `README.md` and examples on `gh-pages` branch.
  On examples page, dynamically load source code from content of page. Check
  it out!
* Sheetrock now passes linting with JSHint.
* Better comments, more descriptive variable names.
