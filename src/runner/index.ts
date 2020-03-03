import axios from 'axios';
import { WalrusTest } from 'src/types/walrus_test';
import { WalrusTestExecution } from 'src/types/walrus_test_execution';
import logger from '../logger';

const WALRUS_API = 'https://api.walrus.ai';

async function pollTest(test: WalrusTest, authToken: string): Promise<WalrusTestExecution> {
  return new Promise((resolve) => {
    let timeout!: NodeJS.Timeout; // eslint-disable-line prefer-const

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${WALRUS_API}/${test.gid}`, {
          headers: { 'X-Walrus-Token': authToken },
        });

        if (response.status === 202) {
          logger.debug(`Walrus Test ${test.gid} still pending.`);
        } else {
          logger.debug(`Walrus Test ${test.gid} completed.`);

          if (timeout) {
            clearTimeout(timeout);
          }

          clearInterval(interval);
          resolve({ name: test.name, ...response.data });
        }
      } catch (e) {
        logger.warn(`Polling Walrus Test ${test.gid} failed: ${e}`);
      }
    }, 5000);

    timeout = setTimeout(() => {
      clearInterval(interval);
      resolve({
        name: test.name!,
        success: false,
        error: `Walrus Test ${test.gid} timed out.`
      });
    }, 3600000);
  });
}

export async function runTests(
  tests: WalrusTest[],
  authToken: string
): Promise<WalrusTestExecution[]> {
  return await Promise.all(tests.map(async (test) => {
    try {
      const result = await axios.post(WALRUS_API, { ...test, options: { mode: 'poll' } }, { headers: { 'X-Walrus-Token': authToken } });

      return await pollTest({ ...test, gid: result.data.data.gid, state: result.data.data.state }, authToken);
    } catch (e) {
      let error = e.message;

      if (e.response && e.response.data.error) {
        error = e.response.data.error;
      }

      return { name: test.name, success: false, error };
    }
  }));
}
