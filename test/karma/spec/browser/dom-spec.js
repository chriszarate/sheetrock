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

  var responseArgs;
  var testOptions;

  var bootstrappedData = window.__fixtures__['bootstrapped'];

  describe('Sheetrock', function () {

    describe('DOM interaction', function () {

      it('passes a DOM element as target', function (done) {

        var asyncCallback = function () {
          responseArgs = arguments;
          done();
        };

        var rowTemplate = function () {
          return 'FAKEHTML';
        };

        var testDiv = document.createElement('div');

        testOptions = {
          url: 'http://example.com/spreadsheets/d/12345#gid=dom',
          target: testDiv,
          callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback),
          rowTemplate: jasmine.createSpy('testRowTemplate').and.callFake(rowTemplate)
        };

        sheetrock(testOptions, bootstrappedData);

        it('calls the callback', function () {
          expect(testOptions.callback).toHaveBeenCalled();
          expect(testOptions.callback.calls.count()).toEqual(1);
        });

        it('doesn\'t return an error', function () {
          var error = responseArgs[0];
          expect(error).toBeDefined();
          expect(error).toBe(null);
        });

        it('calls the row template', function () {
          expect(testOptions.rowTemplate).toHaveBeenCalled();
          expect(testOptions.rowTemplate.calls.count()).toEqual(bootstrappedData.table.rows.length);
        });

      });

      describe('appends HTML to the target element', function () {

        it('with table cells', function () {
          expect(testOptions.target.innerHTML.indexOf('FAKEHTML')).not.toEqual(-1);
        });

      });

    });

  });

}));
