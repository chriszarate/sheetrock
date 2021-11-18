import { throwCannotChangeQuery, throwMissingSelect } from './error';
import { ensureInteger } from './util';

export default class Query {
  params: GoogleApiQueryParams;

  constructor() {
    this.params = {
      limit: 0,
      offset: 0,
    };
  }

  canChangeQuery(): boolean {
    if (this.params.offset === 0) {
      return true;
    }

    return throwCannotChangeQuery();
  }

  getParam(key: string): string {
    let value = `${this.params[key] || ''}`.trim();

    if (key === 'limit') {
      // The Google API generates an unrecoverable error when the 'offset' is
      // larger than the number of available rows, which is problematic for
      // paged requests. As a workaround, we request one more row than we need
      // and stop when we see less rows than we requested.
      value = this.params.limit ? `${this.params.limit + 1}` : '';
    }

    return value ? `${key.toLowerCase()} ${value}` : '';
  }

  getQueryString(): string {
    const select = this.getParam('select');
    const where = this.getParam('where');
    const groupBy = this.getParam('groupBy');
    const pivot = this.getParam('pivot');
    const orderBy = this.getParam('orderBy');
    const limit = this.getParam('limit');
    const offset = this.getParam('offset');
    const label = this.getParam('label');
    const format = this.getParam('format');
    const options = this.getParam('options');

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

  setParamAsString(key: string, value: string): void {
    if (value === this.params[key]) {
      return;
    }

    this.canChangeQuery();
    this.params[key] = value;
  }

  setParamAsInteger(key: string, value: number): void {
    if (value === this.params[key]) {
      return;
    }

    this.params[key] = ensureInteger(value);
  }

  format(format: string): this {
    this.setParamAsString('format', format);
    return this;
  }

  groupBy(groupBy: string): this {
    this.setParamAsString('groupBy', groupBy);
    return this;
  }

  label(label: string): this {
    this.setParamAsString('label', label);
    return this;
  }

  limit(limit: number): this {
    this.setParamAsInteger('limit', limit);
    return this;
  }

  // If you provide a limit, the offset is automatically incremented after the
  // query is fetched. Therefore, there is usually not a need to set this manually.
  offset(offset: number): this {
    this.setParamAsInteger('offset', offset);
    return this;
  }

  options(options: string): this {
    this.setParamAsString('options', options);
    return this;
  }

  orderBy(orderBy: string): this {
    this.setParamAsString('orderBy', orderBy);
    return this;
  }

  pivot(pivot: string): this {
    this.setParamAsString('pivot', pivot);
    return this;
  }

  select(select: string): this {
    this.setParamAsString('select', select);
    return this;
  }

  where(where: string): this {
    this.setParamAsString('where', where);
    return this;
  }
}
