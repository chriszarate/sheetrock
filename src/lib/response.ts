import { throwUnexpectedColumn } from './error';
import { getCellValue } from './util';

export default class Response {
  data: GoogleDataTableResponse;

  headers: SheetrockHeader[];

  rows: SheetrockRow[];

  constructor(rawResponse: GoogleDataTableResponse) {
    this.data = rawResponse;
    this.rows = this.getRows();
    this.headers = this.getHeaders();
  }

  getHeaders(): SheetrockHeader[] {
    if (this.rows.length === 0) {
      return [];
    }

    const [headerRow] = this.rows;
    return Object.keys(headerRow).map((key) => ({
      id: key,
      label: headerRow[key].label,
    }));
  }

  getRows(): SheetrockRow[] {
    return this.data.table.rows.map((row) => {
      // This should never happen.
      if (row.c.length > this.data.table.cols.length) {
        throwUnexpectedColumn(row.c.length, this.data.table.cols.length);
      }

      return row.c.reduce((acc, cell, columnNumber) => {
        const { id, label } = this.data.table.cols[columnNumber];
        const value: SheetrockCellValue = cell ? getCellValue(cell.v) : null;
        const formattedValue = value ? value.toString() : '';

        const sheetrockCell: SheetrockCell = {
          formattedValue,
          id,
          label,
          styles: {},
          value,
        };

        return Object.assign(acc, { [id]: sheetrockCell });
      }, {});
    });
  }
}
