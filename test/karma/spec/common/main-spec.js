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

  var expected = window.__fixtures__['expected'];

  describe('Sheetrock', function () {
    expected.formats.forEach(function (format) {
      var responseArgs;
      var testOptions;

      describe('first request', function () {

        it('retrieves data from a Google Sheet', function (done) {

          var asyncCallback = function () {
            responseArgs = arguments;
            done();
          };

          testOptions = {
            url: format.url,
            query: 'select A,B,C,D,E,L where E = \'Both\' order by L desc',
            fetchSize: 10,
            labels: Object.keys(expected.output.rows.row10),
            callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback),
            rowTemplate: jasmine.createSpy('testRowTemplate')
          };

          sheetrock(testOptions);

        });

        it('calls the callback', function () {
          expect(testOptions.callback).toHaveBeenCalled();
          expect(testOptions.callback.calls.count()).toEqual(1);
        });

        it('calls the row template', function () {
          expect(testOptions.rowTemplate).toHaveBeenCalled();
          expect(testOptions.rowTemplate.calls.count()).toEqual(testOptions.fetchSize);
        });

        it('doesn\'t return an error', function () {
          var error = responseArgs[0];
          expect(error).toBeDefined();
          expect(error).toBe(null);
        });

        describe('returns an options object', function () {

          it('with expected properties', function () {
            var options = responseArgs[1];
            expect(options).toBeDefined();
            expect(options).not.toBe(null);
            expect(options.user).toBeDefined();
            expect(options.request).toBeDefined();
          });

        });

        describe('returns a response object', function () {

          it('with expected properties', function () {
            var response = responseArgs[2];
            expect(response).toBeDefined();
            expect(response).not.toBe(null);
          });

          it('with attributes', function () {
            var response = responseArgs[2];
            expect(response.attributes).toBeDefined();
            expect(response.attributes).not.toBe(null);
          });

        });

        describe('returns raw data', function () {

          it('with expected properties', function () {
            var response = responseArgs[2];
            expect(response.raw).toBeDefined();
            expect(response.raw).not.toBe(null);
            expect(response.raw.status).toEqual('ok');
          });

          it('with the expected dimensions', function () {
            var response = responseArgs[2];
            expect(response.raw.table.cols.length).toEqual(testOptions.labels.length);
            expect(response.raw.table.rows.length).toEqual(testOptions.fetchSize + 1);
          });

        });

        describe('returns a row array', function () {

          it('with expected properties', function () {
            var response = responseArgs[2];
            expect(response.rows).toBeDefined();
            expect(response.rows).not.toBe(null);
            expect(Array.isArray(response.rows)).toBe(true);
          });

          it('with the expected dimensions', function () {
            var response = responseArgs[2];
            expect(response.rows.length).toEqual(testOptions.fetchSize + 1);
          });

          it('containing the expected row 10', function () {
            var response = responseArgs[2];
            expect(response.rows[10].cells).toEqual(expected.output.rows.row10);
            expect(response.rows[10].cellsArray.length).toEqual(response.rows[10].labels.length);
            expect(response.rows[10].labels).toEqual(Object.keys(response.rows[10].cells));
            expect(response.rows[10].num).toEqual(10);
          });

        });

        describe('returns output HTML', function () {

          it('with expected properties', function () {
            var response = responseArgs[2];
            expect(response.html).toBeDefined();
            expect(response.html).not.toBe(null);
            expect(typeof response.html).toEqual('string');
          });

        });

      });

      describe('second request', function () {

        it('retrieves more data from a Google Sheet', function (done) {

          var asyncCallback = function () {
            responseArgs = arguments;
            done();
          };

          testOptions.fetchSize = 50;
          testOptions.rowTemplate = null;
          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);

          sheetrock(testOptions);

        });

        it('calls the callback', function () {
          expect(testOptions.callback).toHaveBeenCalled();
          expect(testOptions.callback.calls.count()).toEqual(1);
        });

        describe('returns a row array', function () {

          it('containing the expected row 15', function () {
            var response = responseArgs[2];
            expect(response.rows[4].num).toEqual(15);
            expect(response.rows[4].cells).toEqual(expected.output.rows.row15);
          });

        });

        describe('returns output HTML', function () {

          it('with expected properties', function () {
            var response = responseArgs[2];
            expect(response.html).toBeDefined();
            expect(response.html).not.toBe(null);
            expect(typeof response.html).toEqual('string');
            expect(response.html.indexOf('<tr><td>')).not.toEqual(-1);
          });

        });

      });

      describe('third request', function () {

        it('fails to retrieve more data from a Google Sheet', function (done) {

          var asyncCallback = function (error) {
            expect(error).not.toBe(null);
            expect(error.message).toEqual('No more rows to load!');
            done();
          };

          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);
          sheetrock(testOptions);

        });

      });

      describe('fourth request', function () {

        it('retrieves data after resetting the request', function (done) {

          var asyncCallback = function (error, options, response) {
            expect(error).toBe(null);
            expect(response.raw).not.toBe(null);
            expect(response.raw.table.rows.length).toEqual(testOptions.fetchSize + 1);
            done();
          };

          testOptions.fetchSize = 20;
          testOptions.reset = true;
          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);
          sheetrock(testOptions);

        });

      });

      describe('fifth request', function () {

        it('retrieves data after a previous call has reset the request', function (done) {

          var asyncCallback = function (error, options, response) {
            expect(error).toBe(null);
            expect(response.raw).not.toBe(null);
            expect(response.raw.table.rows.length).toEqual(testOptions.fetchSize + 1);
            done();
          };

          testOptions.fetchSize = 10;
          testOptions.reset = false;
          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);
          sheetrock(testOptions);

        });

      });

    });

  });

}));
