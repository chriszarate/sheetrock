# Sheetrock

[![Build Status][build-status]][travis-ci]

Sheetrock is a JavaScript library for querying, retrieving, and displaying data
from Google Sheets. In other words, use a Google spreadsheet as your database!
Load entire worksheets or leverage SQL-like queries to sort, group, and filter
data. All you need is the URL of a public Google Sheet.

Sheetrock can be used in the browser or on the server (Node.js). It has no
dependencies—but if jQuery is available, it will register as a plugin.

Basic retrieval is a snap but you can also:

* Query sheets using the SQL-like [Google Visualization query language][query]
  (filters, pivots, sorting, grouping, and more)

* Lazy-load large data sets (infinite scroll with ease)

* Easily mix in your favorite templating system ([Handlebars][handlebars],
  [Underscore][underscore], etc.)

* Customize to your heart’s content with your own callbacks

Here’s an example (using jQuery) of how easy it is:

```javascript
$("#my-table").sheetrock({
  url: "https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0",
  query: "select A,B,C,D,E,L where E = 'Both' order by L desc"
});
```

For many more examples and accompanying jsFiddles, visit
**[chriszarate.github.io/sheetrock][gh-pages]**.


## Installation

Install Sheetrock with `npm install sheetrock` or `bower install sheetrock`. Or
just grab [the latest version][latest] and stash it in your project:

```html
<script src="sheetrock.min.js"></script>
```

Shreetrock is also available on [CDNJS][cdnjs]:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/sheetrock/1.0.0/dist/sheetrock.min.js"></script>
```


## Version 1.0

In version 1.0, Sheetrock has introduced a few backwards-incompatible changes,
although most basic requests will still work. Most changes make it simpler to
use; read the options below or the [CHANGELOG][changelog] for more details.

The previous `0.3.x` branch is [still available][0.3.x] and maintained.


## Options

Sheetrock expects a hash map of options as a parameter, e.g.:

```javascript
sheetrock({
  url: "https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0",
  query: "select A,B,C,D,E,L where E = 'Both' order by L desc",
  callback: function () {/* callback code */}
});
```

Your options override Sheetrock’s defaults on a per-request basis. You can also
globally override defaults like this:

```javascript
sheetrock.defaults.url = "https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0";
```


### url

* Expects string

The URL of a public Google spreadsheet. This is the only required option.
(*See* [How do I make a spreadsheet public?][public])


### query

* Expects string

A [Google Visualization API query][query] string. Use column letters in your
queries (e.g., `select A,B,D`).


### target

* Expects DOM element

A DOM element that Sheetrock should append HTML output to. In a browser, for
example, you can use `document.getElementById` to reference a single element.
If you are using Sheetrock with jQuery, you can use the jQuery plugin syntax
(e.g., `$('#my-table').sheetrock({/* options */})`) and ignore this option.


### fetchSize

* Expects non-negative integer

Use this option to load a portion of the available rows. When set to `0` (the
default), Sheetrock will fetch all available rows. When set to `10`, it will
fetch ten rows and keep track of how many rows have been requested. On the next
request with the same query, it will pick up where it left off.


### labels

* Expects array of strings

Override the returned column labels with an array of strings. Without this
option, if you use your own `rowTemplate`, you must reference column labels
exactly as they are returned by Google’s API. If your `sql` query uses `group`,
`pivot`, or any of the [manipulation functions][manip], you will notice that
Google’s returned column labels can be hard to predict. In those cases, this
option can prove essential. The length of this array must match the number of
columns in the returned data.


### rowTemplate

* Expects function

By default, Sheetrock will output your data in simple HTML. Providing your own
row template is an easy way to customize the formatting. Your function should
accept a row object. A row object has two properties: `num`, which contains a
row number (headers = `0`, first data row = `1`, and so on); and `cells`, which
is itself an object. The properties of `cells` will be named after the column
labels as Google interprets them (e.g., `A`, `B`)—or you can use the `labels`
the define them yourself. Your function should return a DOM object or an HTML
string that is ready to be appended to your target element. A very easy way to
do this is to provide a compiled [Handlebars][handlebars] or [Underscore][underscore]
template (which is itself a function).


### callback

* Expects function

You can provide a function to be called when all processing is complete. The
function will be passed the following parameters, in this order:

* Error (object): If the request failed, this parameter will be a JavaScript
  error; otherwise, it will be `null`. Always test for an error before using
  the other parameters.

* Options (object): An object representing the options of the request. The
  `user` property will contain the options you originally provided (useful for
  identifying which request the callback is for) and a `request` property with
  information about the request to Google’s API.

* Raw data (object): This is the raw response data from Google’s API.

* Table rows (array): An array of row objects (which are also passed
  individually to the `rowTemplate`, if one is provided).

* Output HTML (string): A string of HTML representing the final presentational
  output of the request (which is also appended to the `target` or jQuery
  reference, if one was provided).


### headers

* Expects non-negative integer

The number of header rows in your spreadsheet. The default value is `0`, but
this doesn’t necessarily correspond to zero header rows. Google tries to
auto-detect header rows, with unpredictable results. Try omitting this option
if at all possible.


### reset

* Expects Boolean

Reset request status. By default, Sheetrock remembers the row offset of a
request, whether a request has been completely loaded already, or if it
previously failed. Set to `true` to reset these indicators. This is useful if
you want to reload data or load it in another context.


## Caching

On large spreadsheets (~5,000 rows), the performance of Google’s API when using
the `query` option can be sluggish and, in some cases, can severely affect the
responsiveness of your application. At this point, consider caching the
responses for reuse via a `callback` function.


## Tips and troubleshooting



## Projects using Sheetrock

Tell me about your project on the [Wiki][wiki]!


## Change log

*See* [CHANGELOG.md][changelog].


## Credits and license

Sheetrock was written by [Chris Zarate][me]. It was inspired in part by
[Tabletop.js][tabletop] (which will teach you jazz piano). [John Brecht][brecht]
came up with the name. Sheetrock is released under the [MIT license][license].


[build-status]: https://travis-ci.org/chriszarate/sheetrock.svg?branch=master
[travis-ci]: https://travis-ci.org/chriszarate/sheetrock
[public]: https://support.google.com/drive/bin/answer.py?hl=en&answer=2494822
[query]: https://developers.google.com/chart/interactive/docs/querylanguage
[underscore]: http://underscorejs.org
[handlebars]: http://handlebarsjs.com
[gh-pages]: http://chriszarate.github.io/sheetrock/
[latest]: http://chriszarate.github.io/sheetrock/dist/sheetrock.min.js
[unminified]: http://chriszarate.github.io/sheetrock/src/sheetrock.js
[cdnjs]: https://cdnjs.com
[0.3.x]: https://github.com/chriszarate/sheetrock/tree/0.3.0
[wiki]: https://github.com/chriszarate/sheetrock/wiki/Projects-using-Sheetrock
[changelog]: https://github.com/chriszarate/sheetrock/blob/master/CHANGELOG.md
[me]: http://chris.zarate.org
[tabletop]: http://builtbybalance.com/Tabletop/
[brecht]: http://about.me/john.brecht
[license]: http://opensource.org/licenses/MIT
