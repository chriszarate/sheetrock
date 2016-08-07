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

  describe('Sheetrock', function () {

    var responseArgs;
    var testOptions;

    describe('bad request URL', function () {

      it('can be requested', function (done) {

        var asyncCallback = function () {
          responseArgs = arguments;
          done();
        };

        testOptions = {
          url: 'http://example.com/spreadsheets/d/12345#gid=error',
          callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
        };

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        sheetrock(testOptions);

      });

      it('calls the callback', function () {
        expect(testOptions.callback).toHaveBeenCalled();
        expect(testOptions.callback.calls.count()).toEqual(1);
      });

      it('returns an error', function () {
        var error = responseArgs[0];
        expect(error).toBeDefined();
        expect(error.message).toEqual('Request failed.');
      });

    });

  });

}));
