'use strict';

/*global window,sheetrock,bootstrappedData*/
/*jshint jasmine: true*/

describe('Sheetrock JSON transport', function () {

  var responseArgs;
  var testOptions;

  it('can be used', function (done) {

    var asyncCallback = function () {
      responseArgs = arguments;
      done();
    };

    var fakeRequest = function (options, callback) {
      var response = {
        statusCode: 200
      };
      callback(null, response, JSON.stringify(bootstrappedData));
    };

    testOptions = {
      url: 'http://example.com/spreadsheets/d/111/edit#gid=dummy',
      callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
    };

    sheetrock.environment.document = {};
    sheetrock.environment.request = jasmine.createSpy('testRequest').and.callFake(fakeRequest);
    sheetrock(testOptions);

  });

  it('sets the dom environment flag', function () {
    expect(sheetrock.environment.dom).toEqual(false);
  });

  it('is used', function () {
    expect(sheetrock.environment.request).toHaveBeenCalled();
    expect(sheetrock.environment.request.calls.count()).toEqual(1);
  });

  it('calls the callback', function () {
    expect(testOptions.callback).toHaveBeenCalled();
    expect(testOptions.callback.calls.count()).toEqual(1);
  });

  it('parses and returns JSON', function () {
    var json = responseArgs[2];
    expect(json).toBeDefined();
    expect(json.raw).toBeDefined();
    expect(json.raw).toEqual(bootstrappedData);
  });

  it('can trigger a JSON parse error', function (done) {

    var asyncCallback = function () {
      responseArgs = arguments;
      done();
    };

    var fakeRequest = function (options, callback) {
      var response = {
        statusCode: 200
      };
      callback(null, response, 'invalid json');
    };

    testOptions = {
      url: 'http://example.com/spreadsheets/d/222/edit#gid=dummy',
      callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
    };

    sheetrock.environment.request = jasmine.createSpy('testRequest').and.callFake(fakeRequest);
    sheetrock(testOptions);

  });

  it('returns a JSON parse error', function () {
    var error = responseArgs[0];
    var body = responseArgs[2];
    expect(error).toBeDefined();
    expect(error.message).toContain('JSON Parse error');
    expect(body.raw).toEqual('invalid json');
  });

  it('can trigger an HTTP error', function (done) {

    var asyncCallback = function () {
      responseArgs = arguments;
      done();
    };

    var fakeRequest = function (options, callback) {
      var response = {
        statusCode: 500
      };
      callback(null, response, '{}');
    };

    testOptions = {
      url: 'http://example.com/spreadsheets/d/333/edit#gid=dummy',
      callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
    };

    sheetrock.environment.request = jasmine.createSpy('testRequest').and.callFake(fakeRequest);
    sheetrock(testOptions);

  });

  it('returns an HTTP error', function () {
    var error = responseArgs[0];
    expect(error).toBeDefined();
    expect(error.message).toEqual('Request failed.');
  });

  it('expects a function', function (done) {

    var asyncCallback = function () {
      responseArgs = arguments;
      done();
    };

    testOptions = {
      url: 'http://example.com/spreadsheets/d/444/edit#gid=dummy',
      callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
    };

    sheetrock.environment.request = false;
    sheetrock(testOptions);

  });

  it('throws an error', function () {
    var error = responseArgs[0];
    expect(error).toBeDefined();
    expect(error.message).toEqual('No HTTP transport available.');
  });

  it('can be reversed by restoring the document object', function () {
    sheetrock.environment.document = window.document;
    expect(sheetrock.environment.document).toEqual(window.document);
  });

});
