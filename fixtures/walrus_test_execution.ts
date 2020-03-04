import { WalrusTestExecution } from 'src/types/walrus_test_execution';

export const walrusTestExecutionFixture = (overrides: Partial<WalrusTestExecution> = {}): WalrusTestExecution => ({
  data: {
    video: 'https://app.walrus.ai/integration-test/gid-123',
  },
  name: 'test name',
  success: true,
  ...overrides,
});
