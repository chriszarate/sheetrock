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

  describe('Sheetrock options', function () {

    describe('invocation', function () {

      it('overrides defaults', function (done) {

        var asyncCallback = function (error, options) {
          expect(options.user.url).toEqual('RUNTIME_VALUE');
          expect(options.user.query).toEqual('RUNTIME_VALUE');
          expect(options.user.ignoredOption).toEqual('RUNTIME_VALUE');
          expect(options.user.reset).toEqual(false);
          done();
        };

        this.testCallback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);

        sheetrock({
          url: 'RUNTIME_VALUE',
          query: 'RUNTIME_VALUE',
          ignoredOption: 'RUNTIME_VALUE',
          callback: this.testCallback
        }, {});

      });

    });

    describe('validation', function () {

      it('rejects an invalid URL', function (done) {

        var asyncCallback = function (error) {
          expect(error).not.toBe(null);
          expect(error.message).toEqual('No key/gid in the provided URL.');
          done();
        };

        this.testCallback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);

        sheetrock({
          url: 'https://docs.google.com/spreadsheets/d/12345',
          callback: this.testCallback
        });

      });

      it('requires a callback or DOM target', function (done) {

        var errorHandler = function (error) {
          expect(error).not.toBe(null);
          expect(error.message).toEqual('No element targeted or callback provided.');
          done();
        };

        this.testCallback = jasmine.createSpy('testCallback').and.callFake(errorHandler);

        try {
          sheetrock();
        } catch (error) {
          this.testCallback(error);
        }

      });

    });

    afterEach(function () {
      expect(this.testCallback).toHaveBeenCalled();
      expect(this.testCallback.calls.count()).toEqual(1);
    });

  });

}));
