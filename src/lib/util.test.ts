import { getEndpoint } from './util';

describe('getEndpoint', () => {
  it.each([
    'https://example.com/somepath',
    'https://docs.google.com/anyprefix/d/abcdefg123456789',
    'https://docs.google.com/spreadsheets/d/#gid=0',
    'https://docs.google.com/spreadsheet?key=&gid=0',
  ])('rejects an invalid URL', (url) => {
    expect(() => getEndpoint(url)).toThrow('No key/gid in the provided URL');
  });

  it('correctly parses a 2010 URL', () => {
    const url = 'https://spreadsheets.google.com/sheet?key=123&gid=5';
    const expected = 'https://spreadsheets.google.com/tq?key=123&gid=5';

    expect(getEndpoint(url)).toEqual(expected);
  });

  it('correctly parses a 2014 URL', () => {
    const url = 'https://docs.google.com/spreadsheets/d/123/edit#gid=5';
    const expected = 'https://docs.google.com/spreadsheets/d/123/gviz/tq?gid=5';

    expect(getEndpoint(url)).toEqual(expected);
  });

  it('provides a default gid for a 2010 URL', () => {
    const url = 'https://spreadsheets.google.com/sheet?key=123';
    const expected = 'https://spreadsheets.google.com/tq?key=123&gid=0';

    expect(getEndpoint(url)).toEqual(expected);
  });

  it('provides a default gid for a 2014 URL', () => {
    const url = 'https://docs.google.com/spreadsheets/d/123/edit#gid=';
    const expected = 'https://docs.google.com/spreadsheets/d/123/gviz/tq?gid=0';

    expect(getEndpoint(url)).toEqual(expected);
  });
});
