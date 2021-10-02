export function throwInvalidUrl(): never {
  throw new Error('No key/gid in the provided URL.');
}

export function throwUnexpectedColumn(expected: number, actual: number): never {
  throw new Error(
    `The returned row data has ${actual} columns, expected ${expected}.`
  );
}

export function throwRequestDone(): never {
  throw new Error('No more rows to load!');
}

export function throwRequestFailed(status: number): never {
  throw new Error(`Request failed: ${status}`);
}

export function throwRequestTimedOut(delay: number): never {
  throw new Error(`Request timed out after ${delay} seconds`);
}
