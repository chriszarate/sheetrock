import {
  throwInvalidUrl,
  throwRequestFailed,
  throwRequestTimedOut,
  throwUnexpectedColumn,
} from './error';

describe('throwInvalidUrl', () => {
  it('throws', () => {
    expect(throwInvalidUrl).toThrow('No key/gid in the provided URL');
  });
});

describe('throwRequestFailed', () => {
  it('throws with status', () => {
    expect(() => throwRequestFailed(333)).toThrow('Request failed: 333');
  });
});

describe('throwRequestTimedOut', () => {
  it('throws with timeout', () => {
    expect(() => throwRequestTimedOut(300)).toThrow(
      'Request timed out after 300 seconds'
    );
  });
});

describe('throwUnexpectedColumn', () => {
  it('throws with actual and expected columns', () => {
    expect(() => throwUnexpectedColumn(4, 5)).toThrow(
      'Returned row data has 5 columns, expected 4'
    );
  });
});
