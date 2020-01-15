export interface WalrusTest {
  gid?: string,
  name: string,
  url: string,
  instructions: string[],
  variables?: { [key: string]: string },
  state?: 'pending' | 'completed',
  error?: string,
  video?: string,
}
