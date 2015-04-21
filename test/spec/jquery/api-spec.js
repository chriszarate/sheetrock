'use strict';

/*global jQuery*/
/*jshint jasmine: true*/

describe('Sheetrock API with jQuery', function () {

  it('registers as a jQuery plugin when possible', function () {
    if (jQuery && jQuery.fn && jQuery.fn.jquery) {
      expect(jQuery.fn.sheetrock).toBeDefined();
    }
  });

});
