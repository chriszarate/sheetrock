export default class Debug {
  enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  log(message: string) {
    if (!this.enabled) {
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`DEBUG: ${message}`);
  }

  logCellDescription(cell: GoogleDataTableCell) {
    if (typeof cell !== 'object') {
      this.log(`Non-object cell: ${JSON.stringify(cell)}`);
      return;
    }

    if (cell === null) {
      return;
    }

    const keys = Object.keys(cell);
    if (keys.some((key) => !['f', 'p', 'v'].includes(key))) {
      this.log(`Expected cell keys f, p, or v, found: ${keys.join(', ')}`);
      return;
    }

    if (cell?.f && typeof cell.f !== 'string') {
      this.log(`Non-string formatted cell value: ${JSON.stringify(cell.f)}`);
      return;
    }

    const valueType = typeof cell.v;
    const isDate = valueType === 'object' && cell.v instanceof Date;
    if (!isDate && !['string', 'number', 'undefined'].includes(valueType)) {
      this.log(
        [`Unexpected cell value type: ${valueType}`, JSON.stringify(cell)].join(
          ' '
        )
      );
    }
  }

  logRequestUrl(url: string) {
    this.log(`Fetching ${url}`);
  }

  logRawResponseDescription(rawResponse: GoogleDataTableResponse) {
    const { table, status, version } = rawResponse;

    if (status !== 'ok') {
      this.log(`Unexpected Google API response status: ${status}`);
    }

    if (version !== '0.6') {
      this.log(`Unexpected Google API response version: ${version}`);
    }

    this.log(
      [
        `Received ${table.rows.length} rows,`,
        `${table.cols.length} columns,`,
        `and ${table.parsedNumHeaders} header rows`,
      ].join(' ')
    );
  }
}
