/*global define, document */
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

  var bootstrappedData = {
    version: '0.6',
    status: 'ok',
    /*jshint camelcase: false */
    /*jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
    warnings: [
      {
        detailed_message: 'fake warning message'
      }
    ],
    /*jscs: enable */
    errors: [
      {
        message: 'fake error message'
      }
    ],
    sig: '__sig__',
    table: {
      cols: [
        {
          id: 'A',
          label: 'Team',
          type: 'string',
          pattern: ''
        },
        {
          id: 'B', label: 'Pos',
          type: 'string',
          pattern: ''
        },
        {
          id: 'C',
          label: 'First',
          type: 'string',
          pattern: ''
        },
        {
          id: 'D',
          label: 'Last',
          type: 'string',
          pattern: ''
        },
        {
          id: 'E',
          label: 'Bats',
          type: 'string',
          pattern: ''
        },
        {
          id: 'L',
          label: 'BA',
          type: 'number',
          pattern: 'General'
        }
      ],
      'rows': [
        {
          c: [
            {
              v: 'MON'
            },
            {
              v: 'LF'
            },
            {
              v: 'Tim'
            },
            {
              v: 'Raines'
            },
            {
              v: 'Both'
            },
            {
              v: 0.334,
              f: '0.334'
            }
          ]
        },
        {
          c: [
            {
              v: 'NYM'
            },
            {
              v: '2B'
            },
            {
              v: 'Wally'
            },
            {
              v: 'Backman'
            },
            {
              v: 'Both'
            },
            {
              v: 0.32,
              f: '0.32'
            }
          ]
        },
        {
          c: [
            {
              v: 'HOU'
            },
            {
              v: 'RF'
            },
            {
              v: 'Kevin'
            },
            {
              v: 'Bass'
            },
            {
              v: 'Both'
            },
            {
              v: 0.311,
              f: '0.311'
            }
          ]
        },
        {
          c: [
            {
              v: 'CHC'
            },
            {
              v: 'OF'
            },
            {
              v: 'Jerry'
            },
            {
              v: 'Mumphrey'
            },
            {
              v: 'Both'
            },
            {
              v: 0.304,
              f: '0.304'
            }
          ]
        },
        {
          c: [
            {
              v: 'PIT'
            },
            {
              v: '2B'
            },
            {
              v: 'Johnny'
            },
            {
              v: 'Ray'
            },
            {
              v: 'Both'
            },
            {
              v: 0.301,
              f: '0.301'
            }
          ]
        },
        {
          c: [
            {
              v: 'STL'
            },
            {
              v: 'MI'
            },
            {
              v: 'Jose'
            },
            {
              v: 'Oquendo'
            },
            {
              v: 'Both'
            },
            {
              v: 0.297,
              f: '0.297'
            }
          ]
        },
        {
          c: [
            {
              v: 'MON'
            },
            {
              v: 'CF'
            },
            {
              v: 'Mitch'
            },
            {
              v: 'Webster'
            },
            {
              v: 'Both'
            },
            {
              v: 0.29,
              f: '0.29'
            }
          ]
        },
        {
          c: [
            {
              v: 'NYM'
            },
            {
              v: 'OF'
            },
            {
              v: 'Mookie'
            },
            {
              v: 'Wilson'
            },
            {
              v: 'Both'
            },
            {
              v: 0.289,
              f: '0.289'
            }
          ]
        },
        {
          c: [
            {
              v: 'MON'
            },
            {
              v: '1B'
            },
            {
              v: 'Wallace'
            },
            {
              v: 'Johnson'
            },
            {
              v: 'Both'
            },
            {
              v: 0.283,
              f: '0.283'
            }
          ]
        },
        {
          c: [
            {
              v: 'STL'
            },
            {
              v: 'SS'
            },
            {
              v: 'Ozzie'
            },
            {
              v: 'Smith'
            },
            {
              v: 'Both'
            },
            {
              v: 0.28,
              f: '0.28'
            }
          ]
        },
        {
          c: [
            {
              v: 'SFG'
            },
            {
              v: 'RF'
            },
            {
              v: 'Chili'
            },
            {
              v: 'Davis'
            },
            {
              v: 'Both'
            },
            {
              v: 0.278,
              f: '0.278'
            }
          ]
        }
      ]
    }
  };

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
