import Debug from './debug';

describe('Debug', () => {
  let consoleInfo: jest.SpyInstance<
    void,
    [message?: any, ...optionalParams: any[]]
  >;

  beforeEach(() => {
    consoleInfo = jest.spyOn(global.console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleInfo.mockRestore();
  });

  describe('log', () => {
    it('does nothing if not enabled', () => {
      const debug = new Debug(false);

      debug.log('Hello!');

      expect(consoleInfo).not.toHaveBeenCalled();
    });

    it('calls console.info if enabled', () => {
      const debug = new Debug(true);

      debug.log('Hello!');

      expect(consoleInfo).toHaveBeenCalledWith('DEBUG: Hello!');
    });
  });
});
