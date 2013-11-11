# jQuery Sheetrock

Sheetrock is a jQuery plugin for querying, retrieving, and displaying data from
Google Spreadsheets. All you need is the URL of a [public Google Spreadsheet][public].
It requires no backend whatsoever—everything is done in the browser.

Basic retrieval is a snap but you can also:

* Query sheets using the SQL-like [Google Visualization query language][query]
  (filters, sorting, grouping, and more)
* Lazy-load large data sets (infinite scroll with ease)
* Mix in your favorite template system ([Handlebars][handlebars],
  [Underscore][underscore], etc.)
* Customize to your heart’s content with your own handlers and callbacks


## Interactive documentation

**Visit [http://chriszarate.github.io/sheetrock/][gh-pages] for a version of
this documentation that includes jsFiddles.**


## Usage

Here’s a very basic example that fetches an entire sheet (from [this spreadsheet][sheet])
and populates a table. (The output is truncated here.)

```html
<table id="stats"></table>
```

```javascript
var mySpreadsheet = 'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0';

$('#stats').sheetrock({
  url: mySpreadsheet
});
```

<table id="stats"><tbody><tr><th>Team</th><th>Pos</th><th>First</th><th>Last</th><th>Bats</th><th>AB</th><th>R</th><th>H</th><th>HR</th><th>RBI</th><th>SB</th><th>BA</th></tr><tr><td>PHI</td><td>MI</td><td>Luis</td><td>Aguayo</td><td>Right</td><td>133</td><td>17</td><td>28</td><td>4</td><td>13</td><td>1</td><td>0.211</td></tr><tr><td>SFG</td><td>UT</td><td>Mike</td><td>Aldrete</td><td>Left</td><td>216</td><td>27</td><td>54</td><td>2</td><td>25</td><td>1</td><td>0.25</td></tr><tr><td>PIT</td><td>LF</td><td>Bill</td><td>Almon</td><td>Right</td><td>196</td><td>29</td><td>43</td><td>7</td><td>27</td><td>11</td><td>0.219</td></tr><tr><td>LAD</td><td>IF</td><td>Dave</td><td>Anderson</td><td>Right</td><td>216</td><td>31</td><td>53</td><td>1</td><td>15</td><td>5</td><td>0.245</td></tr><tr><td>HOU</td><td>C</td><td>Alan</td><td>Ashby</td><td>Both</td><td>315</td><td>24</td><td>81</td><td>7</td><td>38</td><td>1</td><td>0.257</td></tr><tr><td>NYM</td><td>2B</td><td>Wally</td><td>Backman</td><td>Both</td><td>387</td><td>67</td><td>124</td><td>1</td><td>27</td><td>13</td><td>0.32</td></tr><tr><td>HOU</td><td>C</td><td>Mark</td><td>Bailey</td><td>Both</td><td>153</td><td>9</td><td>27</td><td>4</td><td>15</td><td>1</td><td>0.176</td></tr><tr><td>HOU</td><td>RF</td><td>Kevin</td><td>Bass</td><td>Both</td><td>591</td><td>83</td><td>184</td><td>20</td><td>79</td><td>22</td><td>0.311</td></tr><tr><td>CIN</td><td>3B</td><td>Buddy</td><td>Bell</td><td>Right</td><td>568</td><td>89</td><td>158</td><td>20</td><td>75</td><td>2</td><td>0.278</td></tr><tr><td>PIT</td><td>SS</td><td>Rafael</td><td>Belliard</td><td>Right</td><td>309</td><td>33</td><td>72</td><td>0</td><td>31</td><td>12</td><td>0.233</td></tr><tr><td colspan="12"><em>[Output intentionally truncated]</em></td></tr></tbody></table>

---

The entire sheet has hundreds of rows, so loading the whole thing could bog down a
page and overwhelm a reader. By passing a `sql` query, we can limit our scope. We can
also provide a `chunkSize` to load just a portion of the data. We can always grab more
data later—Sheetrock **keeps track of how many rows you’ve requested** and the next
request will pick up where you left off.

Let’s look at switch hitters and rank them by batting average. We’ll ignore the other
stats and fetch just the top ten to help focus the reader’s attention.

```html
<table id="switch-hitters"></table>
```

```javascript
$('#switch-hitters').sheetrock({
  url: mySpreadsheet,
  sql: "select A,B,C,D,E,L where E = 'Both' order by L desc",
  chunkSize: 10
});
```

<table id="quick-stats"><tbody><tr><th>Team</th><th>Pos</th><th>First</th><th>Last</th><th>Bats</th><th>BA</th></tr><tr><td>MON</td><td>LF</td><td>Tim</td><td>Raines</td><td>Both</td><td>0.334</td></tr><tr><td>NYM</td><td>2B</td><td>Wally</td><td>Backman</td><td>Both</td><td>0.32</td></tr><tr><td>HOU</td><td>RF</td><td>Kevin</td><td>Bass</td><td>Both</td><td>0.311</td></tr><tr><td>CHC</td><td>OF</td><td>Jerry</td><td>Mumphrey</td><td>Both</td><td>0.304</td></tr><tr><td>PIT</td><td>2B</td><td>Johnny</td><td>Ray</td><td>Both</td><td>0.301</td></tr><tr><td>STL</td><td>MI</td><td>Jose</td><td>Oquendo</td><td>Both</td><td>0.297</td></tr><tr><td>MON</td><td>CF</td><td>Mitch</td><td>Webster</td><td>Both</td><td>0.29</td></tr><tr><td>NYM</td><td>OF</td><td>Mookie</td><td>Wilson</td><td>Both</td><td>0.289</td></tr><tr><td>MON</td><td>1B</td><td>Wallace</td><td>Johnson</td><td>Both</td><td>0.283</td></tr><tr><td>STL</td><td>SS</td><td>Ozzie</td><td>Smith</td><td>Both</td><td>0.28</td></tr></tbody></table>

### Templating

Tables are nice, but we might want to represent the data in different ways. Let’s
generate an ordered list by passing in an [Underscore][underscore] template. This time
we’ll rank the top five players by home runs.

```html
<h3>NL Home Run Leaders</h3>
<ol id="hr">
  <script type="text/underscore-template" id="hr-template">
    <li>
      <strong><%= cells.First %> <%= cells.Last %></strong>,
      <%= cells.Team %>, <%= cells.HR %>
    </li>
  </script>
</ol>
```

```javascript
var HRTemplate = _.template($('#hr-template').html());

$('#hr').sheetrock({
  url: mySpreadsheet,
  sql: "select A,C,D,I order by I desc",
  chunkSize: 5,
  headersOff: true,
  rowHandler: HRTemplate
});
```

### NL Home Run Leaders
1. **Mike Schmidt**, PHI, 37
2. **Glenn Davis**, HOU, 31
3. **Dave Parker**, CIN, 31
4. **Dale Murphy**, ATL, 29
5. **Eric Davis**, CIN, 27

### Advanced queries

Next, let’s group some data. For a more readable query, we’ll use column labels (`%Team%`
and `%RBI%`) instead of column letters, and we’ll specify the labels we want Sheetrock to
use when it returns the data (`labels: ['Team', 'RBI']`).

```html
<h3>Team RBI</h3>
<ol id="team-rbi">
  <script type="text/underscore-template" id="team-rbi-template">
    <li><strong><%= cells.Team %></strong>, <%= cells.RBI %></li>
  </script>
</ol>
```

```javascript
var RBITemplate = _.template($('#team-rbi-template').html());

$('#team-rbi').sheetrock({
  url: mySpreadsheet,
  sql: "select %Team%,sum(%RBI%) group by %Team% order by sum(%RBI%) desc",
  chunkSize: 5,
  headersOff: true,
  labels: ['Team', 'RBI'],
  rowHandler: RBITemplate
});
```

### Team RBI
1. **NYM**, 686
2. **PHI**, 638
3. **CIN**, 614
4. **SFG**, 595
5. **SDP**, 591


## Options

Sheetrock expects a hash map of options as a parameter, e.g.:

```javascript
$('#table').sheetrock({
  url: '[...]',
  sql: '[...]'
});
```

Your options override Sheetrock’s defaults on a per-request basis. You can also globally
override defaults like this:

```javascript
$.fn.sheetrock.options.url = '[...]';
```

### url
* Default `''`
* Expects string

The URL of a public Google spreadsheet. ([How do I make a spreadsheet public?][public])
This is the only required option.

### sql
* Default `''`
* Expects string

A [Google Visualization API query][query] string. By default, Google only allows column
letters (e.g., A, B) in queries. If you prefer, you can use column labels in your query
and they will be swapped out with the corresponding column letters. Wrap column labels in
percent signs, e.g., `"select %name%,%age% where %age% > 21"`.

### chunkSize
* Default `0`
* Expects non-negative integer

Use this option to enable lazy-loading or chunking of the data. When set to `0`, Sheetrock
will fetch all available rows. When set to `10`, for example, it will fetch ten rows and keep
track of how many rows have been requested (by storing an `offset` on the targeted element
using jQuery’s `$.data`). On the next request, it will pick up where it left off.

### columns
* Default `{}`
* Expects hash map of column letters to strings

If you want don’t want to bother with making sure the column labels that you use in your
query match the ones used in the spreadsheet—they must match exactly—you can override
them using a hash map, e.g., `{A: 'ID', B: 'Name', C: 'Phone'}`. This also avoids the
overhead (additional AJAX request) of prefetching the column labels.

### labels
* Default `[]`
* Expects array of strings

Override the *returned* column labels with an array of strings. This option is useful when
you have complicated queries and would like a shorthand way of referencing them in your
templates. The length of this array must match the number of columns in the returned data.

### rowHandler
* Default `_output` (internal function; provides HTML table row output)
* Expects function

Providing your own row handler is the recommended way to override the default table row
formatting. Your function should accept a row object. A row object has two properties:
`num`, which contains a row number (header = `0`, first data row = `1`, and so on); and
`cells`, which is itself an object. The properties of `cells` will be named after the
column labels of the returned data (e.g., `Team`, `RBI`). Your function should return
content (a DOM/jQuery object or an HTML string) that is ready to be appended to your target
element. A very easy way to do this is to provide a compiled [Handlebars][handlebars] or
[Underscore][underscore] template (which is itself a function).

### cellHandler
* Default `_trim` (internal function; trims white space)
* Expects function

The cell handler is used to process every cell value. It should return a string.

### dataHandler
* Default `_parse` (internal function; loops through data and calls row handler)
* Expects function

Providing your own data handler means you don’t want any data processing to take place
except for basic validation and inspection. The returned data, if valid, is passed to
your data handler (with the options hash as `this`) and it will be completely up to you
to do something with it. The cell handler and row handler will not be called.

### userCallback
* Default `$.noop`
* Expects function

You can provide a function to be called when all processing is complete. The options
hash is passed to this function.

### loading
* Default `$()`
* Expects jQuery object or selector

If you have a loading indicator on your page, provide a jQuery object or selector here.
It will be shown when the request starts and hidden when it ends.

### debug
* Default `false`
* Expects Boolean

Output raw request and response data to the browser console. Useful for debugging when you
are using your own handlers.

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
* Default `false`
* Expects Boolean

Set to `true` to enable use of row group tags (`<thead>` and `<tbody>`).

### formatting
* Default `false`
* Expects Boolean

For each cell, Google passes along HTML formatting intended to replicate any formatting you
applied in the spreadsheet. It’s usually a bit wacky, so take care when enabling this option.


## Caching

On large spreadsheets (~5000 rows), the performance of Google’s API when using
`sql` queries can be sluggish and, in some cases, can severely affect the
responsiveness of your application. At this point, consider caching the
responses for reuse.

* If you need to change the Google API endpoint—maybe because you want to use
a caching proxy like Amazon CloudFront—use the (undocumented) `server` option.

* Sheetrock provides a way to reuse manually cached data. It accepts a second
parameter of response data to be used instead of making an API request (e.g.,
`$('#table').sheetrock(options, cachedResponse);`). Make sure you pass an
object and not a JSON string.


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
* Tell me about your project on the [Wiki][wiki]!


## Credits and license

Sheetrock was inspired by [Tabletop.js][tabletop] (which will teach you jazz
piano). [John Brecht][brecht] came up with the name. Sheetrock is released
under the MIT license.


[public]:     https://support.google.com/drive/bin/answer.py?hl=en&answer=2494822
[query]:      https://developers.google.com/chart/interactive/docs/querylanguage
[underscore]: http://underscorejs.org
[handlebars]: http://handlebarsjs.com
[gh-pages]:   http://chriszarate.github.io/sheetrock/
[sheet]:      https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0
[tags]:       https://github.com/mlaa/tags-viewer
[wiki]:       https://github.com/chriszarate/sheetrock/wiki/Projects-using-Sheetrock
[tabletop]:   http://builtbybalance.com/Tabletop/
[brecht]:     http://about.me/john.brecht
