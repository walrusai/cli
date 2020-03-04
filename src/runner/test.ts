import nock from 'nock';
import { WalrusTest } from 'src/types/walrus_test';
import { walrusTestFixture } from 'fixtures/walrus_test';
import * as runner from 'src/runner';

describe('src/runner', () => {
  describe('#runTests', () => {
    let tests: WalrusTest[];
    let authToken: string;
    let scope: nock.Scope;

    beforeEach(() => {
      tests = [walrusTestFixture(), walrusTestFixture()];
      authToken = 'authToken';

      scope = nock('https://api.walrus.ai')
        .post('/', { ...tests[0], options: { mode: 'poll' } })
        .reply(200, { data: { gid: tests[0].gid, state: 'pending' } })
        .post('/', { ...tests[1], options: { mode: 'poll' } })
        .reply(200, { data: { gid: tests[1].gid, state: 'pending' } })
        .get(`/${tests[0].gid}`, {})
        .reply(200, { success: true, data: { video: `https://app.walrus.ai/integration-test/${tests[0].gid}` } })
        .get(`/${tests[1].gid}`, {})
        .reply(200, { success: false, data: { video: `https://app.walrus.ai/integration-test/${tests[1].gid}` } });
    });

    it('should make requests and poll', async () => {
      await runner.runTests(tests, authToken);

      expect(scope.isDone()).toEqual(true);
    }, 10000);
  });
});
