import Row from './row';
import SheetrockError from './error';

import * as util from './util';

// Get useful information about the response.
class Response {
  constructor(request) {
    this.request = request;
    this.options = request.options;
  }

  setAttributes() {
    const fetchSize = this.options.user.fetchSize;
    const rows = this.raw.table.rows;
    const cols = this.raw.table.cols;

    // Initialize a hash for the response attributes.
    const attributes = {
      last: rows.length - 1,
      rowNumberOffset: this.request.state.header || 0,
    };

    // Determine if Google has extracted column labels from a header row.
    let columnLabels = this.request.state.labels;
    if (!this.request.state.offset) {
      // Use extracted column labels, the first row, or column letter.
      columnLabels = cols.map((col, i) => {
        if (col.label) {
          return col.label.replace(/\s/g, '');
        }

        // Get column labels from the first row of the response.
        attributes.last += 1;
        attributes.rowNumberOffset = 1;
        return util.getCellValue(rows[0].c[i]) || col.id;
      });

      this.request.update({
        header: attributes.rowNumberOffset,
        labels: columnLabels,
        offset: this.request.state.offset + attributes.rowNumberOffset,
      });
    }

    // The Google API generates an unrecoverable error when the 'offset' is
    // larger than the number of available rows, which is problematic for
    // paged requests. As a workaround, we request one more row than we need
    // and stop when we see less rows than we requested.

    // Remember whether this request has been fully loaded.
    if (!fetchSize || (rows.length - attributes.rowNumberOffset) < fetchSize) {
      attributes.last += 1;
      this.request.update({ loaded: true });
    }

    // If column labels are provided and have the expected length, use them.
    const userLabels = this.options.user.labels;
    const userLabelsValid = userLabels && userLabels.length === columnLabels.length;
    attributes.labels = userLabelsValid ? userLabels : columnLabels;

    // Return the response attributes.
    this.attributes = attributes;
  }

  // Parse data, row by row, and generate a simpler output array.
  setOutput() {
    this.rows = [];

    // Add a header row constructed from the column labels, if appropriate.
    if (!this.request.state.offset && !this.attributes.rowNumberOffset) {
      this.rows.push(new Row(0, this.attributes.labels, this.attributes.labels));
    }

    // Each table cell ('c') can contain two properties: 'p' contains
    // formatting and 'v' contains the actual cell value.

    // Loop through each table row.
    this.raw.table.rows.forEach((row, i) => {
      // Proceed if the row has cells and the row index is within the targeted
      // range. (This avoids displaying too many rows when paging data.)
      if (row.c && i < this.attributes.last) {
        // Get the "real" row index (not counting header rows). Create a row
        // object and add it to the output array.
        const counter = (this.request.state.offset + i + 1) - this.attributes.rowNumberOffset;
        this.rows.push(new Row(counter, row.c, this.attributes.labels));
      }
    });

    // Remember the new row offset.
    this.request.update({
      offset: this.request.state.offset + this.options.user.fetchSize,
    });
  }

  // Generate HTML from rows using a template.
  setHTML() {
    const target = this.options.user.target;
    const template = this.options.user.rowTemplate || util.toHTML;
    const isTable = util.isTable(target);
    const needsHeader = target && util.hasClass(target, 'sheetrock-header');

    // Pass each row to the row template. Only parse header rows if the target
    // is a table or indicates via className that it wants the header.
    let headerHTML = '';
    let bodyHTML = '';
    this.rows.forEach((row) => {
      if (row.num) {
        bodyHTML += template(row);
      } else if (isTable || needsHeader) {
        headerHTML += template(row);
      }
    });

    if (isTable) {
      headerHTML = util.wrapTag(headerHTML, 'thead');
      bodyHTML = util.wrapTag(bodyHTML, 'tbody');
    }

    util.append(target, headerHTML + bodyHTML);

    this.html = headerHTML + bodyHTML;
  }

  // Load API response.
  loadData(rawData, callback) {
    this.raw = rawData;

    try {
      this.setAttributes();
      this.setOutput();
    } catch (error) {
      callback(new SheetrockError('Unexpected API response format.'));
      return;
    }

    // Don't catch errors thrown in setHTML; let the user handle them.
    this.setHTML();
    callback(null);
  }
}

export default Response;
