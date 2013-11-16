## Change Log

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
