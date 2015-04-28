/*global define */
/*jshint jasmine: true*/

(function (root, tests) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['sheetrock', 'bootstrappedData'], function (sheetrock, bootstrappedData) {
      tests(sheetrock, bootstrappedData);
    });
  } else if (typeof module === 'object' && module.exports) {
    tests(require('../../../src/sheetrock.js'), require('../../data/bootstrappedData.js'));
  } else {
    tests(root.sheetrock, root.bootstrappedData);
  }

}(this, function (sheetrock, bootstrappedData) {

  'use strict';

  var responseArgs;
  var testOptions;

  describe('Sheetrock', function () {

    describe('bootstrap API', function () {

      it('accepts bootstrapped data as a parameter', function (done) {

        var asyncCallback = function () {
          responseArgs = arguments;
          done();
        };

        testOptions = {
          url: 'http://example.com/spreadsheets/d/12345#gid=1',
          callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback),
          rowTemplate: jasmine.createSpy('testRowTemplate')
        };

        sheetrock(testOptions, bootstrappedData);

      });

      it('calls the callback', function () {
        expect(testOptions.callback).toHaveBeenCalled();
        expect(testOptions.callback.calls.count()).toEqual(1);
      });

      it('calls the row template', function () {
        expect(testOptions.rowTemplate).toHaveBeenCalled();
        expect(testOptions.rowTemplate.calls.count()).toEqual(bootstrappedData.table.rows.length);
      });

      it('doesn\'t return an error', function () {
        var error = responseArgs[0];
        expect(error).toBeDefined();
        expect(error).toBe(null);
      });

      it('returns the bootstrapped data', function () {
        var response = responseArgs[2];
        expect(response.raw).toBe(bootstrappedData);
      });

      it('rejects malformed bootstrapped data', function (done) {

        var asyncCallback = function (error) {
          expect(error).toBeDefined();
          expect(error.message).toEqual('Unexpected API response format.');
          done();
        };

        testOptions = {
          url: 'http://example.com/spreadsheets/d/12345#gid=bootstrap',
          reset: true,
          callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
        };

        sheetrock(testOptions, {});

      });

    });

  });

}));
