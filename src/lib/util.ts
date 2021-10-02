import { throwInvalidUrl, throwUnexpectedColumn } from './error';

function getMatch(input: string, pattern: string): string | null {
  const regExp = new RegExp(pattern, 'i');
  const match = input.match(regExp);
  if (match) {
    return match[1];
  }

  return null;
}

export function ensureInteger(maybeInt: any): number {
  if (Number.isInteger(maybeInt)) {
    return maybeInt;
  }

  return parseInt(maybeInt, 10) || 0;
}

function getCellValue(value: GoogleDataTableCellValue): SheetrockCellValue {
  const dateRegExp = /^Date\(((\d+,){2,}\d+)\)$/;

  if (typeof value === 'string' && dateRegExp.test(value)) {
    const [, stringArgs] = value.match(dateRegExp) || [];
    const numArgs: number[] = stringArgs.split(',').map(Number);
    const [Y, M, D, h = 12, m = 0, s = 0] = numArgs;

    return new Date(Date.UTC(Y, M, D, h, m, s));
  }

  if (Array.isArray(value)) {
    if (value.length >= 2) {
      const [h, m, s = 0, ms = 0] = value;

      return new Date(Date.UTC(1970, 0, 1, h, m, s, ms));
    }

    return value.join(',');
  }

  return value;
}

export function getEndpoint(url: string): string {
  const key2010 = getMatch(url, 'key=([^&#]+)');
  const gid = getMatch(url, 'gid=([^/&#]+)') || 0;

  if (key2010) {
    return [
      'https://spreadsheets.google.com/tq',
      `?key=${encodeURIComponent(key2010)}`,
      `&gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  const key2014 = getMatch(url, 'spreadsheets/d/([^/#]+)');

  if (key2014) {
    return [
      `https://docs.google.com/spreadsheets/d/${key2014}/gviz/tq`,
      `?gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  return throwInvalidUrl();
}

export function getHeaders(rows: SheetrockRow[]): SheetrockHeader[] {
  if (rows.length === 0) {
    return [];
  }

  const [headerRow] = rows;
  return Object.keys(headerRow).map((key) => ({
    id: key,
    label: headerRow[key].label,
  }));
}

export function getRows(data: GoogleDataTableResponse): SheetrockRow[] {
  return data.table.rows.map((row) => {
    // This should never happen.
    if (row.c.length > data.table.cols.length) {
      throwUnexpectedColumn(row.c.length, data.table.cols.length);
    }

    return row.c.reduce((acc, cell, i) => {
      const { id, label } = data.table.cols[i];
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
