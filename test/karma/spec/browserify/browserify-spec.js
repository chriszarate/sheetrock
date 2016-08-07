/* eslint-disable */

var sheetrock = require('../../../../dist/src');

describe('Sheetrock via Browserify', function () {

  it('loads the module', function () {
    expect(typeof sheetrock).toEqual('function');
  });

  it('doesn\'t expose a global', function () {
    expect(window.sheetrock).not.toBeDefined();
  });

});
