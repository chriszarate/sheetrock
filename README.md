# jQuery Sheetrock

Sheetrock is a flexible jQuery plugin for querying and retrieving data from Google 
Spreadsheets. It leverages the (powerful) Google Visualization API, which allows 
filtering, sorting, grouping, and other SQL-like queries.

Sheetrock works with Google Spreadsheets of all sizes—you can retrieve an entire sheet 
or **load a little bit at a time**. Using the [Google Visualization query language][query], 
you can construct **custom views** of your data on the fly. It has no dependencies 
besides jQuery and requires no backend whatsoever—everything is done in the browser 
using HTML and JavaScript. All you need is the URL of a public Google Spreadsheet to 
use as a data source.

By default, Sheetrock’s formatting is pretty basic, but customizing the output is 
easy: just drop in an [Underscore][underscore] or [Handlebars][handlebars] template, 
or provide your own callback function.


## Use

This simple example fetches an entire sheet and populates a table. (The output is 
truncated here.)

	<table id="statistics"></table>
	
	<script>
		var myOptions = { url: 'https://docs.google.com/spreadsheet/ccc?key=[...]#gid=0' }; 
		$('#statistics').sheetrock(myOptions);
	</script>

<table id="statistics"><tbody><tr><th>Team</th><th>Pos</th><th>First</th><th>Last</th><th>Bats</th><th>AB</th><th>R</th><th>H</th><th>HR</th><th>RBI</th><th>SB</th><th>BA</th></tr><tr><td>PHI</td><td>MI</td><td>Luis</td><td>Aguayo</td><td>Right</td><td>133</td><td>17</td><td>28</td><td>4</td><td>13</td><td>1</td><td>0.211</td></tr><tr><td>SFG</td><td>UT</td><td>Mike</td><td>Aldrete</td><td>Left</td><td>216</td><td>27</td><td>54</td><td>2</td><td>25</td><td>1</td><td>0.25</td></tr><tr><td>PIT</td><td>LF</td><td>Bill</td><td>Almon</td><td>Right</td><td>196</td><td>29</td><td>43</td><td>7</td><td>27</td><td>11</td><td>0.219</td></tr><tr><td>LAD</td><td>IF</td><td>Dave</td><td>Anderson</td><td>Right</td><td>216</td><td>31</td><td>53</td><td>1</td><td>15</td><td>5</td><td>0.245</td></tr><tr><td>HOU</td><td>C</td><td>Alan</td><td>Ashby</td><td>Both</td><td>315</td><td>24</td><td>81</td><td>7</td><td>38</td><td>1</td><td>0.257</td></tr><tr><td>NYM</td><td>2B</td><td>Wally</td><td>Backman</td><td>Both</td><td>387</td><td>67</td><td>124</td><td>1</td><td>27</td><td>13</td><td>0.32</td></tr><tr><td>HOU</td><td>C</td><td>Mark</td><td>Bailey</td><td>Both</td><td>153</td><td>9</td><td>27</td><td>4</td><td>15</td><td>1</td><td>0.176</td></tr><tr><td>HOU</td><td>RF</td><td>Kevin</td><td>Bass</td><td>Both</td><td>591</td><td>83</td><td>184</td><td>20</td><td>79</td><td>22</td><td>0.311</td></tr><tr><td>CIN</td><td>3B</td><td>Buddy</td><td>Bell</td><td>Right</td><td>568</td><td>89</td><td>158</td><td>20</td><td>75</td><td>2</td><td>0.278</td></tr><tr><td>PIT</td><td>SS</td><td>Rafael</td><td>Belliard</td><td>Right</td><td>309</td><td>33</td><td>72</td><td>0</td><td>31</td><td>12</td><td>0.233</td></tr><tr><td colspan="12">[...]</td></tr></tbody></table>

---

The entire sheet has hundreds of rows, so loading the whole thing could bog down a 
page and overwhelm a reader. By passing a `sql` query, we can limit our scope. We can 
also provide a `chunkSize` to load just a portion of the data. We can always grab more 
data later—Sheetrock **keeps track of how many rows you’ve requested** and the next 
request will pick up where you left off.

Let’s look at switch hitters and rank them by batting average. We’ll ignore the other 
stats and fetch just the top ten to help focus the reader’s attention.

	<table id="statistics"></table>
	
	<script>

		var myOptions = {
			url: 'https://docs.google.com/spreadsheet/ccc?key=[...]#gid=0',
			sql: "select A,B,C,D,E,L where B = 'Both' order by L desc",
			chunkSize: 10
		};

		$('#statistics').sheetrock(myOptions);

	</script>

<table id="statistics"><tbody><tr><th>Team</th><th>Pos</th><th>First</th><th>Last</th><th>Bats</th><th>BA</th></tr><tr><td>MON</td><td>LF</td><td>Tim</td><td>Raines</td><td>Both</td><td>0.334</td></tr><tr><td>NYM</td><td>2B</td><td>Wally</td><td>Backman</td><td>Both</td><td>0.32</td></tr><tr><td>HOU</td><td>RF</td><td>Kevin</td><td>Bass</td><td>Both</td><td>0.311</td></tr><tr><td>CHC</td><td>OF</td><td>Jerry</td><td>Mumphrey</td><td>Both</td><td>0.304</td></tr><tr><td>PIT</td><td>2B</td><td>Johnny</td><td>Ray</td><td>Both</td><td>0.301</td></tr><tr><td>STL</td><td>MI</td><td>Jose</td><td>Oquendo</td><td>Both</td><td>0.297</td></tr><tr><td>MON</td><td>CF</td><td>Mitch</td><td>Webster</td><td>Both</td><td>0.29</td></tr><tr><td>NYM</td><td>OF</td><td>Mookie</td><td>Wilson</td><td>Both</td><td>0.289</td></tr><tr><td>MON</td><td>1B</td><td>Wallace</td><td>Johnson</td><td>Both</td><td>0.283</td></tr><tr><td>STL</td><td>SS</td><td>Ozzie</td><td>Smith</td><td>Both</td><td>0.28</td></tr></tbody></table>

---

Tables are nice, but we might want to represent the data in different ways. Let’s 
generate an ordered list by passing in an [Underscore][underscore] template. This time 
we’ll rank the top five players by home runs.

	<h3>NL Home Run Leaders</h3>
	<ol id="leaders">
		<script type="text/underscore-template" id="my-template">
			<li><strong><%= cells.First %> <%= cells.Last %></strong>, <%= cells.Team %>, <%= cells.HR %></li>
		</script>
	</ol>
	
	<script>

		var myTemplate = _.template($('#my-template').html());

		var myOptions = {
			url: 'https://docs.google.com/spreadsheet/ccc?key=[...]#gid=0',
			sql: "select A,C,D,I order by I desc",
			chunkSize: 5,
			headers: 1,
			rowHandler: myTemplate
		};

		$('#leaders').sheetrock(myOptions);

	</script>

### NL Home Run Leaders
1. **Mike Schmidt**, PHI, 37
2. **Glenn Davis**, HOU, 31
3. **Dave Parker**, CIN, 31
4. **Dale Murphy**, ATL, 29
5. **Eric Davis**, CIN, 27

---

You can also group data easily:

	<h3>Team RBI</h3>
	<ol id="leaders">
		<script type="text/underscore-template" id="my-template">
			<li><strong><%= cells.Team %></strong>, <%= cells.RBI %></li>
		</script>
	</ol>
	
	<script>

		var myTemplate = _.template($('#my-template').html());

		var myOptions = {
			url: 'https://docs.google.com/spreadsheet/ccc?key=[...]#gid=1',
			sql: "select A,avg(J) group by A order by avg(J) desc",
			chunkSize: 5,
			headers: 1,
			labels: ['Team', 'Avg'],
			rowHandler: myTemplate
		};

		$('#leaders').sheetrock(myOptions);

	</script>

### Team RBI
1. **NYM**, 686
2. **PHI**, 638
3. **CIN**, 614
4. **SFG**, 595
5. **SDP**, 591

---

## To-do

* Explain the rest of the advanced options (in the meantime, the source is annotated).
* Describe how to make a Google Spreadsheet public.
* Live demo
* New features?


## Credits and license

Sheetrock was inspired by [Tabletop.js][tabletop] (which will teach you jazz piano). 
[John Brecht][brecht] came up with the name. Sheetrock is released under the MIT 
license.


[query]:      https://developers.google.com/chart/interactive/docs/querylanguage
[underscore]: http://underscorejs.org
[handlebars]: http://handlebarsjs.com
[tabletop]:   http://builtbybalance.com/Tabletop/
[brecht]:     http://about.me/john.brecht