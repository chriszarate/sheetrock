import { ensureInteger } from './util';

describe('ensureInteger', () => {
  it.each([11, 11.0, 11.01, '11', '   11   '])(
    'parses integers, numbers, and number-like strings',
    (maybeInt) => {
      expect(ensureInteger(maybeInt)).toEqual(11);
    }
  );

  it.each([null, false, NaN, '', '   ', 'test'])(
    'returns 0 for non-integers',
    (maybeInt) => {
      expect(ensureInteger(maybeInt)).toEqual(0);
    }
  );
});
