import ora from 'ora';
import chalk from 'chalk';
import { WalrusTest } from '../types/walrus_test';
import { WalrusTestExecution } from '../types/walrus_test_execution';
import logger from '../logger';

export async function reportTests(
  tests: WalrusTest[],
  runner: (tests: WalrusTest[]) => Promise<WalrusTestExecution[]>,
): Promise<boolean> {
  const message = `Running ${tests.length} test${tests.length > 1 ? 's' : ''}`;
  let spinner;

  if (logger.transports[0].level === 'info') {
    spinner = ora(message).start();
  } else {
    logger.info(message);
  }

  const executions = await runner(tests);

  if (spinner) {
    spinner.stop();
  }

  const successes = executions.filter((value) => !value.error);
  const failures = executions.filter((value) => value.error);

  logger.info(chalk.green(`Successes: ${successes.length}`));

  for (const execution of successes) {
    logger.info(JSON.stringify(execution, null, 2));
  }

  logger.info(chalk.red(`Failures: ${failures.length}`));

  for (const execution of failures) {
    logger.info(JSON.stringify(execution, null, 2));
  }

  if (failures.length !== 0) {
    process.exitCode = 1;
  }

  return failures.length === 0;
}
