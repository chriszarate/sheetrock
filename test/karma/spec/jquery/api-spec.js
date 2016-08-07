'use strict';

/*global jQuery*/
/*jshint jasmine: true*/

describe('Sheetrock API with jQuery', function () {

  it('expects jQuery to be defined as a global', function () {
    expect(jQuery && jQuery.fn && jQuery.fn.jquery).toBeDefined();
  });

  it('registers as a jQuery plugin when possible', function () {
    expect(jQuery.fn.sheetrock).toBeDefined();
  });

  it('turns on the jQuery environment flag', function () {
    expect(jQuery.fn.sheetrock.environment.jquery).toBeDefined();
    expect(jQuery.fn.sheetrock.environment.jquery).not.toBe(false);
  });

});
