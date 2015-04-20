'use strict';

/*global window*/
/*jshint jasmine: true*/

describe('Sheetrock with jQuery', function () {

  it('registers as a jQuery plugin when possible', function () {
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.jquery) {
      expect(window.jQuery.fn.sheetrock).toBeDefined();
    }
  });

});
