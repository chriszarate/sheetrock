// Defaults for Sheetrock user options.
const defaults = {
  url: '',           // String  -- Google Sheet URL
  query: '',         // String  -- Google Visualization API query
  target: null,      // DOM Element -- An element to append output to
  fetchSize: 0,      // Integer -- Number of rows to fetch (0 = all)
  labels: [],        // Array   -- Override *returned* column labels
  rowTemplate: null, // Function / Template
  callback: null,    // Function
  reset: false,      // Boolean -- Reset request status
};

// Map of legacy (pre-v1.0.0) option names to current user option names.
const legacyOptions = {
  sql: 'query',
  resetStatus: 'reset',
  chunkSize: 'fetchSize',
  rowHandler: 'rowTemplate',
};

// Google Visualization API endpoints and parameter formats.
const sheetTypes = {
  2014: {
    apiEndpoint: 'https://docs.google.com/spreadsheets/d/%key%/gviz/tq?',
    keyFormat: new RegExp('spreadsheets/d/([^/#]+)', 'i'),
    gidFormat: new RegExp('gid=([^/&#]+)', 'i'),
  },
  2010: {
    apiEndpoint: 'https://spreadsheets.google.com/tq?key=%key%&',
    keyFormat: new RegExp('key=([^&#]+)', 'i'),
    gidFormat: new RegExp('gid=([^/&#]+)', 'i'),
  },
};

export {
  defaults,
  legacyOptions,
  sheetTypes,
};
