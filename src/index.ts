/*!
 * Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * https://chriszarate.github.io/sheetrock/
 * License: MIT
 */

import Debug from './lib/debug';
import { throwCannotChangeQuery, throwMissingSelect } from './lib/error';
import Transport from './lib/transport';
import { getHeaders, getRows, ensureInteger } from './lib/util';

export default class Sheetrock {
  debug: Debug;

  done: boolean = false;

  query: GoogleApiQuery;

  transport: Transport;

  version: string = '2.0.0';

  constructor(options: SheetrockOptions) {
    const { debug = true, url = '' } = options || {};

    this.debug = new Debug(debug);
    this.query = {
      limit: 0,
      offset: 0,
    };
    this.transport = new Transport(url, debug);
  }

  canChangeQuery(): boolean {
    if (this.query.offset === 0) {
      return true;
    }

    return throwCannotChangeQuery();
  }

  async get(): Promise<SheetrockResponse> {
    const rawResponse = await this.getRaw();
    const rows = getRows(rawResponse);
    const headers = getHeaders(rows);

    return {
      headers,
      meta: {
        done: this.done,
        offset: this.query.offset,
        version: this.version,
      },
      rows,
    };
  }

  async getRaw(): Promise<GoogleDataTableResponse> {
    if (this.done) {
      this.debug.logDone();
    }

    const tq = this.getQueryString();
    const data = await this.transport.fetch(tq);

    // If the returned data has limit + 1 rows, then there are more rows to
    // fetch. Remove the extra row. Update the offset so that the user can pick
    // up where they left off.
    //
    // If the returned data has less than limit + 1 rows, we've reached the end
    // of the sheet.
    if (data.table.rows.length === this.query.limit + 1) {
      data.table.rows.splice(-1);
      this.offset(this.query.offset + this.query.limit);
    } else {
      this.done = true;
    }

    return data;
  }

  getQueryParam(key: string): string {
    let value = `${this.query[key] || ''}`.trim();

    if (key === 'limit') {
      // The Google API generates an unrecoverable error when the 'offset' is
      // larger than the number of available rows, which is problematic for
      // paged requests. As a workaround, we request one more row than we need
      // and stop when we see less rows than we requested.
      value = this.query.limit ? `${this.query.limit + 1}` : '';
    }

    return value ? `${key.toLowerCase()} ${value}` : '';
  }

  getQueryString(): string {
    const select = this.getQueryParam('select');
    const where = this.getQueryParam('where');
    const groupBy = this.getQueryParam('groupBy');
    const pivot = this.getQueryParam('pivot');
    const orderBy = this.getQueryParam('orderBy');
    const limit = this.getQueryParam('limit');
    const offset = this.getQueryParam('offset');
    const label = this.getQueryParam('label');
    const format = this.getQueryParam('format');
    const options = this.getQueryParam('options');

    // Some statements require a select.
    if (!select && (groupBy || pivot)) {
      return throwMissingSelect();
    }

    // The order of statements in the query must match a specific order.
    return [
      select,
      where,
      groupBy,
      pivot,
      orderBy,
      limit,
      offset,
      label,
      format,
      options,
    ]
      .filter(Boolean)
      .join(' ');
  }

  setStringQuery(key: string, value: string): void {
    if (value === this.query[key]) {
      return;
    }

    this.canChangeQuery();
    this.query[key] = value;
  }

  format(format: string): this {
    this.setStringQuery('format', format);
    return this;
  }

  groupBy(groupBy: string): this {
    this.setStringQuery('groupBy', groupBy);
    return this;
  }

  label(label: string): this {
    this.setStringQuery('label', label);
    return this;
  }

  limit(limit: number): this {
    this.query.limit = ensureInteger(limit);
    return this;
  }

  // If you provide a limit, the offset is automatically incremented after the
  // query is fetched.
  offset(offset: number): this {
    this.query.offset = ensureInteger(offset);
    return this;
  }

  options(options: string): this {
    this.setStringQuery('options', options);
    return this;
  }

  orderBy(orderBy: string): this {
    this.setStringQuery('orderBy', orderBy);
    return this;
  }

  pivot(pivot: string): this {
    this.setStringQuery('pivot', pivot);
    return this;
  }

  reset(): this {
    this.done = false;
    this.offset(0);

    return this;
  }

  select(select: string): this {
    this.setStringQuery('select', select);
    return this;
  }

  where(where: string): this {
    this.setStringQuery('where', where);
    return this;
  }
}
