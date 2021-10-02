export function throwCannotChangeQuery(): never {
  throw new Error('Cannot change query after fetching rows');
}

export function throwInvalidUrl(): never {
  throw new Error('No key/gid in the provided URL.');
}

export function throwMissingSelect(): never {
  throw new Error('Cannot use `groupby` or `pivot` without `select`');
}

export function throwRequestFailed(status: number): never {
  throw new Error(`Request failed: ${status}`);
}

export function throwRequestTimedOut(delay: number): never {
  throw new Error(`Request timed out after ${delay} seconds`);
}

export function throwUnexpectedColumn(expected: number, actual: number): never {
  throw new Error(
    `Returned row data has ${actual} columns, expected ${expected}.`
  );
}
