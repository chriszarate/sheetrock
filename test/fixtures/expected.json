/*global define */

(function (root, data) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('testData', data);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = data;
  } else {
    root.testData = data;
  }

}(this, {
  urls: [
    // "Legacy" (pre-2014)
    'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0',
    // "New" (2014 and later)
    'https://docs.google.com/spreadsheets/d/1qT1LyvoAcb0HTsi2rHBltBVpUBumAUzT__rhMvrz5Rk/edit?usp=sharing#gid=0'
  ],
  rows: {
    row10: {
      team: 'STL',
      position: 'SS',
      firstName: 'Ozzie',
      lastName: 'Smith',
      bats: 'Both',
      average: '0.280'
    },
    row15: {
      team: 'HOU',
      position: 'C',
      firstName: 'Alan',
      lastName: 'Ashby',
      bats: 'Both',
      average: '0.257'
    }
  }
}));
