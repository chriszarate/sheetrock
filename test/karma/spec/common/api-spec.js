/* eslint-disable */

(function (root, tests) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['sheetrock'], function (sheetrock) {
      tests(sheetrock);
    });
  } else if (typeof module === 'object' && module.exports) {
    tests(require('../../../../dist/src'));
  } else {
    tests(root.sheetrock);
  }

}(this, function (sheetrock) {

  'use strict';

  describe('Sheetrock API', function () {

    it('exposes a function', function () {
      expect(typeof sheetrock).toEqual('function');
    });

    it('exposes defaults', function () {
      expect(sheetrock.defaults).toBeDefined();
    });

    it('exposes a version number', function () {
      expect(sheetrock.version).toBeDefined();
    });

  });

}));
