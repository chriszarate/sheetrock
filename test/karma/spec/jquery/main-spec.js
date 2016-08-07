/* eslint-disable */

'use strict';

describe('Sheetrock', function () {

  var expected = window.__fixtures__['expected'];
  var requestURL = expected.formats[1].url;

  var responseArgs;
  var testOptions;

  it('appends a table to the DOM', function () {
    jQuery('body').append('<table id="testTable"></table>');
    expect(jQuery('#testTable').length).toBe(1);
  });

  it('retrieves data from a Google Sheet', function (done) {

    var asyncCallback = function () {
      responseArgs = arguments;
      done();
    };

    testOptions = {
      url: requestURL,
      query: 'select A,B,C,D,E',
      fetchSize: 10,
      callback: jasmine.createSpy('testCallback').and.callFake(asyncCallback)
    };

    jQuery('#testTable').sheetrock(testOptions);

  });

  it('calls the callback', function () {
    expect(testOptions.callback).toHaveBeenCalled();
    expect(testOptions.callback.calls.count()).toEqual(1);
  });

  it('doesn\'t return an error', function () {
    var error = responseArgs[0];
    expect(error).toBeDefined();
    expect(error).toBe(null);
  });

  it('appends HTML to the targeted element', function () {
    expect(jQuery('#testTable').html().indexOf('<tr><td>')).not.toEqual(-1);
  });

});
