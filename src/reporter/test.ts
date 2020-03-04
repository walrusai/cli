import { WalrusTest } from 'src/types/walrus_test';
import { WalrusTestExecution } from 'src/types/walrus_test_execution';
import { walrusTestFixture } from 'fixtures/walrus_test';
import { walrusTestExecutionFixture } from 'fixtures/walrus_test_execution';
import logger from 'src/logger';
import * as reporter from 'src/reporter';

let oraStartMock: jest.Mock;

jest.mock('ora', () => {
  return (_message: string) => ({ start: oraStartMock });
});

describe('src/reporter', () => {
  describe('#reportTests', () => {
    let tests: WalrusTest[];
    let runner: (tests: WalrusTest[]) => Promise<WalrusTestExecution[]>;

    beforeEach(() => {
      oraStartMock = jest.fn();

      tests = [walrusTestFixture({ state: 'completed' }), walrusTestFixture({ state: 'completed' })];
      runner = jest.fn().mockResolvedValue([walrusTestExecutionFixture(), walrusTestExecutionFixture({ success: false, error: 'error' })]);

      logger.transports[0].level = 'info';
      logger.info = jest.fn();
    });

    it('should properly report tests', async () => {
      await reporter.reportTests(tests, runner);

      expect(oraStartMock).toHaveBeenCalledTimes(1);

      expect(runner).toHaveBeenCalledTimes(1);
      expect(runner).toHaveBeenCalledWith(tests);

      expect(logger.info).toHaveBeenCalledTimes(4);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Successes: 1'));
      expect(logger.info).toHaveBeenCalledWith('%o', expect.objectContaining({ success: true }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Failures: 1'));
      expect(logger.info).toHaveBeenCalledWith('%o', expect.objectContaining({ success: false }));
    });
  });
});
