'use strict';

/*global sheetrock*/
/*jshint jasmine: true*/

describe('Sheetrock polyfiller', function () {

  it('provides polyfilled prototypes', function () {
    expect(Array.prototype.forEach).toBeDefined();
    expect(Array.prototype.map).toBeDefined();
    expect(Object.keys).toBeDefined();
    expect(Array.prototype.forEach.toString().indexOf('native code')).toEqual(-1);
    expect(Array.prototype.map.toString().indexOf('native code')).toEqual(-1);
    expect(Object.keys.toString().indexOf('native code')).toEqual(-1);
  });

  it('calls polyfilled prototypes', function (done) {

    var testCallback = jasmine.createSpy('testCallback').and.callFake(done);

    sheetrock({
      callback: testCallback
    });

  });

});
