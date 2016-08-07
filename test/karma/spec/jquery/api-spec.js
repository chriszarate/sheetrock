/* eslint-disable */

'use strict';

describe('Sheetrock API with jQuery', function () {

  it('expects jQuery to be defined as a global', function () {
    expect(jQuery && jQuery.fn && jQuery.fn.jquery).toBeDefined();
  });

  it('registers as a jQuery plugin when possible', function () {
    expect(jQuery.fn.sheetrock).toBeDefined();
  });

});
