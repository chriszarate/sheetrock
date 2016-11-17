import SheetrockError from './error';

// Provide a simple state store shared across requests.
const stateCache = {
  defaults: {
    failed: false,
    header: 0,
    labels: null,
    loaded: false,
    offset: 0,
  },
  store: {},
};

class Request {
  constructor(options) {
    this.options = options;
    this.index = options.requestIndex;

    // Abandon requests that have previously generated an error.
    if (this.state.failed) {
      throw new SheetrockError('A previous request for this resource failed.');
    }

    // Abandon requests that have already been loaded.
    if (this.state.loaded) {
      throw new SheetrockError('No more rows to load!');
    }
  }

  get state() {
    const hasPreviousState = {}.hasOwnProperty.call(stateCache.store, this.index);
    const reset = this.options.user.reset || this.options.request.data;

    if (!hasPreviousState || reset) {
      const savedState = {
        labels: hasPreviousState ? stateCache.store[this.index].labels : null,
      };

      stateCache.store[this.index] = Object.assign({}, stateCache.defaults, savedState);
    }

    return stateCache.store[this.index];
  }

  // Assemble a full URI for the query.
  get url() {
    // If requested, make a request for paged data.
    const size = this.options.user.fetchSize;
    const pageQuery = (size) ? ` limit ${size + 1} offset ${this.state.offset}` : '';

    const queryVars = [
      `gid=${encodeURIComponent(this.options.request.gid)}`,
      `tq=${encodeURIComponent(this.options.user.query + pageQuery)}`,
    ];
    return this.options.request.apiEndpoint + queryVars.join('&');
  }

  // Extend exsiting attributes with passed attributes.
  update(attributes = {}) {
    stateCache.store[this.index] = Object.assign(this.state, attributes);
  }
}

export default Request;
