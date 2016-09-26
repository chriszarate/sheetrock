// Extract the string contained in a cell object.
function getCellValue(cell) {
  let value = cell ? cell.f || cell.v || cell : '';

  // Extract cell value while avoiding array values.
  if (value instanceof Array) {
    value = value.join('');
  }

  if (typeof value === 'object') {
    return '';
  }

  return `${value}`.replace(/^\s+|\s+$/, '');
}

// Extract a DOM element from a possible jQuery blob.
function extractElement(blob) {
  let el = blob;

  if (typeof el === 'object' && el.jquery && el.length) {
    el = el[0];
  }

  return (el && el.nodeType && el.nodeType === 1) ? el : null;
}

// Append HTML output to DOM.
function append(target, html) {
  if (target && target.insertAdjacentHTML) {
    target.insertAdjacentHTML('beforeEnd', html);
  }
}

// Return true if the DOM element has the specified class.
function hasClass(el, className) {
  const classes = ` ${el.className} `;
  return classes.indexOf(` ${className} `) !== -1;
}

// Return true if the DOM element is a table.
function isTable(el) {
  return el && el.tagName === 'TABLE';
}

// Wrap a string in tag.
function wrapTag(str, tag) {
  return `<${tag}>${str}</${tag}>`;
}

// Default row template: Output a row object as an HTML table row. Use "td"
// for table body row, "th" for table header rows.
function toHTML(row) {
  const tag = row.num ? 'td' : 'th';
  let html = '';
  Object.keys(row.cells).forEach((key) => {
    html += wrapTag(row.cells[key], tag);
  });
  return wrapTag(html, 'tr');
}

export {
  append,
  extractElement,
  getCellValue,
  hasClass,
  isTable,
  toHTML,
  wrapTag,
};
