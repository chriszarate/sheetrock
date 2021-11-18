/*!
 * Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * https://chriszarate.github.io/sheetrock/
 * License: MIT
 */

import Debug from './lib/debug';
import Query from './lib/query';
import Response from './lib/response';
import Table from './lib/table';
import Transport from './lib/transport';

export default class Sheetrock extends Query {
  debug: Debug;

  done: boolean = false;

  table: Table;

  transport: Transport;

  version: string = '2.0.0';

  constructor(options: SheetrockOptions) {
    super();

    const { debug = true, table = null, url = '' } = options || {};

    this.debug = new Debug(debug);
    this.table = new Table(table, debug);
    this.transport = new Transport(url, debug);
  }

  async get(): Promise<SheetrockResponse> {
    const data = await this.getRaw();
    const meta = this.getMeta();
    const response = new Response(data);
    const { headers, rows } = response;

    this.table.updateHeader(response);
    this.table.updateBody(response);

    return {
      headers,
      meta,
      rows,
    };
  }

  getMeta(): SheetrockMeta {
    return {
      done: this.done,
      offset: this.params.offset,
      version: this.version,
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
    if (data.table.rows.length === this.params.limit + 1) {
      data.table.rows.splice(-1);
      this.offset(this.params.offset + this.params.limit);
    } else {
      this.done = true;
    }

    return data;
  }

  reset(): this {
    this.done = false;
    this.offset(0);

    return this;
  }
}
