import Debug from './debug';
import { throwRequestDone } from './error';
import Transport from './transport';

export default class Request {
  debug: Debug;

  done: boolean = false;

  offset: number = 0;

  query: string;

  transport: Transport;

  constructor(url: string, query: string = '', debug: Debug) {
    this.debug = debug;
    this.query = query;
    this.transport = new Transport(url, debug);
  }

  async get(pageSize: number = 0): Promise<GoogleDataTableResponse> {
    if (this.done) {
      return throwRequestDone();
    }

    let tq = this.query.trim();

    // If requested via pageSize, paginate the request.
    //
    // The Google API generates an unrecoverable error when the 'offset' is
    // larger than the number of available rows, which is problematic for
    // paged requests. As a workaround, we request one more row than we need
    // and stop when we see less rows than we requested.
    if (pageSize) {
      tq = `${tq} limit ${pageSize + 1} offset ${this.offset}`.trim();
    }

    const data = await this.transport.fetch(tq);

    // If the returned data has pageSize + 1 rows, then there are more rows to
    // fetch. Remove the extra row. Update the offset so that the user can pick
    // up where they left off.
    //
    // If the returned data has less than pageSize + 1 rows, we've reached the
    // end of the sheet.
    if (data.table.rows.length === pageSize + 1) {
      data.table.rows.splice(-1);
      this.offset += pageSize;
    } else {
      this.done = true;
    }

    return data;
  }

  reset() {
    this.done = false;
    this.offset = 0;
  }
}
