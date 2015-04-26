/*global define */
/*jshint jasmine: true*/

(function (root, tests) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['sheetrock'], function (sheetrock) {
      tests(sheetrock);
    });
  } else if (typeof module === 'object' && module.exports) {
    tests(require('../../../src/sheetrock.js'));
  } else {
    tests(root.sheetrock);
  }

}(this, function (sheetrock) {

  'use strict';

  describe('Sheetrock', function () {

    var requestURLs = [
      // "Legacy" (pre-2014)
      'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0',
      // "New" (2014 and later)
      'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0'
    ];

    var testData = {
      row10: {
        team: 'STL',
        position: 'SS',
        firstName: 'Ozzie',
        lastName: 'Smith',
        bats: 'Both',
        average: '0.28'
      },
      row15: {
        team: 'HOU',
        position: 'C',
        firstName: 'Alan',
        lastName: 'Ashby',
        bats: 'Both',
        average: '0.257'
      }
    };

    requestURLs.forEach(function (requestURL) {

      var responseArgs;
      var testOptions;

      describe('first request', function () {

        it('retrieves data from a Google Sheet', function (done) {

          var asyncCallback = function () {
            responseArgs = arguments;
            done();
          };

          testOptions = {
            url: requestURL,
            query: 'select A,B,C,D,E,L where E = \'Both\' order by L desc',
            fetchSize: 10,
            labels: Object.keys(testData.row10),
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
            expect(options.response).toBeDefined();
          });

        });

        describe('returns a raw data object', function () {

          it('with expected properties', function () {
            var rawData = responseArgs[2];
            expect(rawData).toBeDefined();
            expect(rawData).not.toBe(null);
            expect(rawData.status).toEqual('ok');
          });

          it('with the expected dimensions', function () {
            var options = responseArgs[1];
            var rawData = responseArgs[2];
            expect(rawData.table.cols.length).toEqual(testOptions.labels.length);
            expect(rawData.table.rows.length).toEqual(testOptions.fetchSize + 1);
          });

        });

        describe('returns a table array', function () {

          it('with expected properties', function () {
            var rowArray = responseArgs[3];
            expect(rowArray).toBeDefined();
            expect(rowArray).not.toBe(null);
            expect(Array.isArray(rowArray)).toBe(true);
          });

          it('with the expected dimensions', function () {
            var options = responseArgs[1];
            var rowArray = responseArgs[3];
            expect(rowArray.length).toEqual(testOptions.fetchSize + 1);
          });

          it('containing the expected row 10', function () {
            var rowArray = responseArgs[3];
            expect(rowArray[10].num).toEqual(10);
            expect(rowArray[10].cells).toEqual(testData.row10);
          });

        });

        describe('returns output HTML', function () {

          it('with expected properties', function () {
            var outputHTML = responseArgs[4];
            expect(outputHTML).toBeDefined();
            expect(outputHTML).not.toBe(null);
            expect(typeof outputHTML).toEqual('string');
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

        describe('returns a table array', function () {

          it('containing the expected row 15', function () {
            var rowArray = responseArgs[3];
            expect(rowArray[4].num).toEqual(15);
            expect(rowArray[4].cells).toEqual(testData.row15);
          });

        });

        describe('returns output HTML', function () {

          it('with expected properties', function () {
            var outputHTML = responseArgs[4];
            expect(outputHTML).toBeDefined();
            expect(outputHTML).not.toBe(null);
            expect(typeof outputHTML).toEqual('string');
            expect(outputHTML.indexOf('<tr><td>')).not.toEqual(-1);
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

        it('remembers that the previous request failed', function (done) {

          var asyncCallback = function (error) {
            expect(error).not.toBe(null);
            expect(error.message).toEqual('A previous request for this resource failed.');
            done();
          };

          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);
          sheetrock(testOptions);

        });

      });

      describe('fifth request', function () {

        it('retrieves data after resetting the request', function (done) {

          var asyncCallback = function (error, options, rawData) {
            expect(error).toBe(null);
            expect(rawData).not.toBe(null);
            expect(rawData.table.rows.length).toEqual(testOptions.fetchSize + 1);
            done();
          };

          testOptions.fetchSize = 20;
          testOptions.reset = true;
          testOptions.callback = jasmine.createSpy('testCallback').and.callFake(asyncCallback);
          sheetrock(testOptions);

        });

      });

    });

  });

}));
