/*!
 * Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * https://chriszarate.github.io/sheetrock/
 * License: MIT
 */

import Debug from './lib/debug';
import Request from './lib/request';
import Response from './lib/response';

export default class Sheetrock {
  debug: Debug;

  request: Request;

  constructor(options: SheetrockOptions) {
    const { debug = true, query = '', url = '' } = options || {};

    this.debug = new Debug(!!debug);
    this.request = new Request(url, query, this.debug);
  }

  async getRaw(pageSize: number = 0): Promise<GoogleDataTableResponse> {
    return this.request.get(pageSize);
  }

  get(pageSize: number = 0): Promise<SheetrockResponse> {
    const response = new Response(this.request, pageSize);

    return response.fulfill();
  }

  reset() {
    this.request.reset();
  }
}
