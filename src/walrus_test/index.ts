export interface WalrusTest {
  name?: string,
  url: string,
  instructions: string[],
  variables?: { [key: string]: string },
}
