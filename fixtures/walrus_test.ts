import { WalrusTest } from 'src/types/walrus_test';

let CURRENT_ID = 1;

export const walrusTestFixture = (overrides: Partial<WalrusTest> = {}): WalrusTest => ({
  gid: `gid-${++CURRENT_ID}`,
  instructions: ['Do something', 'Do something else'],
  name: 'test name',
  state: 'pending',
  url: 'https://google.com',
  variables: {},
  ...overrides,
});
