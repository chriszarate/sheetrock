# jQuery Sheetrock

[![Build Status][build-status]][travis-ci]

Sheetrock is a jQuery plugin for querying, retrieving, and displaying data
from Google Spreadsheets. Use it to load entire sheets or leverage SQL-like
queries to treat Google Spreadsheets as a quick-and-dirty JSON datastore. All
you need is the URL of a [public Google Spreadsheet][public]. It requires no
backend code whatsoever—everything is done in the browser.

Basic retrieval is a snap but you can also:

* Query sheets using the SQL-like [Google Visualization query language][query]
  (filters, pivots, sorting, grouping, and more)
* Lazy-load large data sets (infinite scroll with ease)
* Mix in your favorite templating system ([Handlebars][handlebars],
  [Underscore][underscore], etc.)
* Customize to your heart’s content with your own handlers and callbacks


## Examples

Visit **[chriszarate.github.io/sheetrock][gh-pages]** for examples and
jsFiddles.


## Usage

Using [Bower][bower]?

```sh
bower install jquery-sheetrock
```

Otherwise, grab [the latest version][latest] ([unminified][unminified]) and
stash it in your project. Sheetrock requires jQuery >= 1.6.

```html
<script src="jquery.min.js"></script>
<script src="jquery.sheetrock.min.js"></script>
```


## Options

Sheetrock expects a hash map of options as a parameter, e.g.:

```javascript
$('#table').sheetrock({
  url: '[...]',
  sql: '[...]'
});
```

Your options override Sheetrock’s defaults on a per-request basis. You can
also globally override defaults like this:

```javascript
$.fn.sheetrock.options.url = '[...]';
```

### url
* Default `''`
* Expects string

The URL of a public Google spreadsheet. This is the only required option.
(*See* [How do I make a spreadsheet public?][public])


### sql
* Default `''`
* Expects string

A [Google Visualization API query][query] string. By default, Google only
allows column letters (e.g., `A`, `B`) in queries. If you prefer, you can use
the column labels of your spreadsheet in your query and they will be swapped
out with the corresponding column letters. To do this, wrap column labels in
percent signs, e.g., `select %name%,%age% where %age% > 21`.


### chunkSize
* Default `0`
* Expects non-negative integer

Use this option to enable lazy-loading or chunking of the data. When set to
`0`, Sheetrock will fetch all available rows. When set to `10`, for example,
it will fetch ten rows and keep track of how many rows have been requested. On
the next request with the same query, it will pick up where it left off.


### columns
* Default `{}`
* Expects hash map of column letters to strings

If you use column labels instead of column letters in your `sql` query (e.g.,
`select %name%`), they must *exactly* match the ones used in your spreadsheet.
If you don’t want to bother with that, you can supply your own column labels,
e.g., `{A: 'ID', B: 'FullName', C: 'Age'}`. Then you can use your supplied
column labels in your `sql` query (e.g., `select %FullName%`). This also
avoids the overhead (additional AJAX request) of prefetching the column
labels. **Note:** This option only applies to your `sql` query and has no
effect on the column labels *returned* by Google’s API (see `labels`, below).


### labels
* Default `[]`
* Expects array of strings

Override the *returned* column labels with an array of strings. If you use
your own row handler or template, you must reference column labels exactly as
they are returned by Google’s API. Further, if your `sql` query uses `group`,
`pivot`, or any of the [manipulation functions][manip], you will notice that
Google’s returned column labels can be hard to predict. In those cases, this
option can prove essential. The length of this array must match the number of
columns in the returned data.


### rowHandler
* Default `_toHTML` (internal function; provides HTML table row output)
* Expects function

Providing your own row handler is the recommended way to override the default
table row formatting. Your function should accept a row object. A row object
has two properties: `num`, which contains a row number (header = `0`, first
data row = `1`, and so on); and `cells`, which is itself an object. The
properties of `cells` will be named after the column labels of the returned
data (e.g., `Team`, `RBI`). Your function should return content (a DOM/jQuery
object or an HTML string) that is ready to be appended to your target element.
A very easy way to do this is to provide a compiled [Handlebars][handlebars] or
[Underscore][underscore] template (which is itself a function).


### cellHandler
* Default `_trim` (internal function; trims white space)
* Expects function

The cell handler is used to process every cell value. It should return a
string.


### dataHandler
* Default `_parseData` (internal function; creates HTML table)
* Expects function

Providing your own data handler means you don’t want any data processing to
take place except for basic validation and inspection. The returned data, if
valid, is passed to your data handler (with the options hash as `this`) and it
will be completely up to you to do something with it. The cell handler and row
handler will not be called.


### errorHandler
* Default `$.noop`
* Expects function

If you provide your own error handler, it will be called if Sheetrock
encounters any AJAX errors (e.g., no network connection). The returned data, if
any, is passed to your error handler (with the options hash as `this`).


### userCallback
* Default `$.noop`
* Expects function

You can provide a function to be called when all processing is complete. The
options hash is passed to this function.


### loading
* Default `$()`
* Expects jQuery object or selector

If you have a loading indicator on your page, provide a jQuery object or
selector here. It will be shown when the request starts and hidden when it
ends.


### headers
* Default `0`
* Expects non-negative integer

The number of header rows in your spreadsheet. Sheetrock tries to identify this
automatically but Google’s response format makes it difficult.


### headersOff
* Default `false`
* Expects Boolean

Set to `true` to suppress output of header row(s) to the row handler.


### rowGroups
* Default `true`
* Expects Boolean

Set to `false` to disable use of row group tags (`<thead>` and `<tbody>`).


### formatting
* Default `false`
* Expects Boolean

Google passes along HTML formatting intended to replicate any formatting you
applied in the spreadsheet. When set to `true`, the default cell handler will
wrap the cell value in a `span` with a `style` attribute. The formatting is
usually a bit wacky, so take care when enabling this option.


### resetStatus
* Default `false`
* Expects Boolean

Reset request status. By default, Sheetrock remembers the row offset of a
request, whether a request has been completely loaded already, or if it
previously failed. Set to `true` to reset these indicators. This is useful if
you want to reload data or load it in another context.


### debug
* Default `false`
* Expects Boolean

Output raw request and response data to the browser console. Useful for
debugging, especially when you are using your own handlers.


## Caching

On large spreadsheets (~5,000 rows), the performance of Google’s API when using
`sql` queries can be sluggish and, in some cases, can severely affect the
responsiveness of your application. At this point, consider caching the
responses for reuse.

* If you need to change the Google API endpoint—maybe because you want to use
  a caching proxy like Amazon CloudFront—use the (undocumented) `server`
  option.

* Sheetrock provides a way to reuse manually cached data. It accepts a second
  parameter of response data to be used instead of making an API request (e.g.,
  `$('#table').sheetrock(options, cachedResponse);`). Make sure you pass a
  JavaScript object and not a JSON string.


## Tips and troubleshooting

* Sheetrock sometimes outputs useful information to the browser console,
  including options validation problems and warnings and errors reported by
  Google’s API.

* When there is an outstanding AJAX request, `$.fn.sheetrock.working` will be
  set to `true`. This can be useful for infinite scroll bindings, for example.

* You can also latch onto the most recent jQuery promise via
  `$.fn.sheetrock.promise`. Make sure you return a another promise so that
  Sheetrock can continue to chain off of it.


## Projects using Sheetrock

* [TAGS Viewer][tags]
* [Equity][equity]
* [Kuppi][kuppi]
* Tell me about your project on the [Wiki][wiki]!


## Change log

*See* [CHANGELOG.md][changelog].


## Credits and license

Sheetrock was written by [Chris Zarate][me]. It was inspired in part by
[Tabletop.js][tabletop] (which will teach you jazz piano).
[John Brecht][brecht] came up with the name. Sheetrock is released under the
[MIT license][license].


[build-status]: https://travis-ci.org/chriszarate/sheetrock.svg?branch=master
[travis-ci]: https://travis-ci.org/chriszarate/sheetrock
[public]: https://support.google.com/drive/bin/answer.py?hl=en&answer=2494822
[query]: https://developers.google.com/chart/interactive/docs/querylanguage
[underscore]: http://underscorejs.org
[handlebars]: http://handlebarsjs.com
[gh-pages]: http://chriszarate.github.io/sheetrock/
[bower]: http://bower.io
[latest]: http://chriszarate.github.io/sheetrock/src/jquery.sheetrock.min.js
[unminified]: http://chriszarate.github.io/sheetrock/src/jquery.sheetrock.js
[tags]: https://github.com/mlaa/tags-viewer
[equity]: https://play.google.com/store/apps/details?id=com.leosoftwares.equity
[kuppi]: https://play.google.com/store/apps/details?id=com.leosoftwares.kuppi
[wiki]: https://github.com/chriszarate/sheetrock/wiki/Projects-using-Sheetrock
[changelog]: https://github.com/chriszarate/sheetrock/blob/master/CHANGELOG.md
[me]: http://chris.zarate.org
[tabletop]: http://builtbybalance.com/Tabletop/
[brecht]: http://about.me/john.brecht
[license]: http://opensource.org/licenses/MIT
