import axios from "axios";
import { WalrusTest } from "src/types/walrus_test";
import { WalrusTestExecution } from "src/types/walrus_test_execution";
import logger from "../logger";

const WALRUS_API = "https://api.walrus.ai";

export async function runTests(
  tests: WalrusTest[],
  authToken: string
): Promise<WalrusTestExecution[]> {
  const starts: WalrusTest[] = await Promise.all(
    tests.map(async test => {
      try {
        const response = await axios.post(
          WALRUS_API,
          { ...test, options: { mode: "poll" } },
          { headers: { "X-Walrus-Token": authToken } }
        );

        return {
          ...test,
          gid: response.data.data.gid,
          state: response.data.data.state
        };
      } catch (error) {
        logger.warn(error);

        return { ...test, error: error.response.data.error };
      }
    })
  );

  return await Promise.all(
    starts.map(
      (test): Promise<WalrusTestExecution> => {
        return new Promise(resolve => {
          const interval = setInterval(async () => {
            try {
              const response = await axios.get(`${WALRUS_API}/${test.gid}`, {
                headers: { "X-Walrus-Token": authToken },
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

          const timeout = setTimeout(() => {
            clearInterval(interval);
            resolve({
              name: test.name!,
              success: false,
              error: `Walrus Test ${test.gid} timed out.`
            });
          }, 3600000);
        });
      }
    )
  );
}
