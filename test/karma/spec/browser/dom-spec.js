/*global define, document */
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

    describe('API', function () {

      it('exposes a dom environment flag', function () {
        expect(sheetrock.environment.dom).toBe(true);
      });

    });

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
