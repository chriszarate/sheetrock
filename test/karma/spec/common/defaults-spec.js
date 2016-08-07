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

  describe('Sheetrock defaults', function () {

    it('can be overridden', function (done) {

      var testCallback = function (error, options) {
        expect(options.user.url).toEqual('OVERRIDE');
        expect(options.user.query).toEqual('OVERRIDE');
        expect(options.user.reset).not.toEqual('OVERRIDE');
        done();
      };

      this.callback = jasmine.createSpy('callback').and.callFake(testCallback);

      sheetrock.defaults.url = 'OVERRIDE';
      sheetrock.defaults.query = 'OVERRIDE';
      sheetrock({
        callback: this.callback
      }, {});

    });

    afterEach(function () {
      expect(this.callback).toHaveBeenCalled();
      expect(this.callback.calls.count()).toEqual(1);
    });

  });

}));
