import Debug from './debug';
import { throwUnexpectedColumn } from './error';
import Request from './request';
import { formatTableRow } from './util';

export default class Response {
  debug: Debug;

  pageSize: number;

  request: Request;

  startTime: number = Date.now();

  version: string = '2.0.0';

  constructor(request: Request, pageSize: number) {
    this.debug = request.debug;
    this.pageSize = pageSize;
    this.request = request;
  }

  getRows(data: GoogleDataTableResponse): SheetrockRow[] {
    const dateRegExp = /^Date\(((\d+,){2,}\d+)\)$/;

    return data.table.rows.map((row) => {
      // This should never happen.
      if (row.c.length > data.table.cols.length) {
        throwUnexpectedColumn(row.c.length, data.table.cols.length);
      }

      return row.c.reduce((acc, cell, i) => {
        const { id, label } = data.table.cols[i];
        const sheetrockCell: SheetrockCell = {
          formattedValue: '',
          id,
          label,
          styles: {},
          value: null,
        };

        if (cell !== null) {
          if (typeof cell.v === 'string' && dateRegExp.test(cell.v)) {
            const [, stringArgs] = cell.v.match(dateRegExp) || [];
            const numArgs: number[] = stringArgs.split(',').map(Number);
            const [Y, M, D, h = 12, m = 0, s = 0] = numArgs;

            sheetrockCell.value = new Date(Date.UTC(Y, M, D, h, m, s));
          }

          if (Array.isArray(cell.v) && cell.v.length >= 2) {
            const [h, m, s = 0, ms = 0] = cell.v;

            sheetrockCell.value = new Date(Date.UTC(1970, 0, 1, h, m, s, ms));
          }

          this.debug.logCellDescription(cell);
        }

        return Object.assign(acc, { [id]: sheetrockCell });
      }, {});
    });
  }

  getTable(rows: SheetrockRow[]): SheetrockResponse['table'] {
    const bodyRows = rows.map((row) => Object.values(row)).map(formatTableCell).join('');

    return {
      headerRows: '',
      bodyRows,
    };
  }

  async fulfill(): Promise<SheetrockResponse> {
    const rawResponse = await this.request.get(this.pageSize);
    const rows = this.getRows(rawResponse);

    return {
      done: this.request.done,
      meta: {
        elapsedTime: Date.now() - this.startTime,
        offset: this.request.offset,
        totalRows: this.request.offset + rawResponse.table.rows.length,
        version: this.version,
      },
      rows,
      table: this.getTable(rows),
    };
  }
}
