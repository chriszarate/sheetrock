/* eslint-disable */

'use strict';

define(['sheetrock'], function (sheetrock) {

  describe('Sheetrock via AMD', function () {

    it('loads the module', function () {
      expect(typeof sheetrock).toEqual('function');
    });

    it('doesn\'t expose a global', function () {
      expect(window.sheetrock).not.toBeDefined();
    });

  });

});
