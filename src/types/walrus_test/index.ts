export interface WalrusTest {
  gid?: string;
  name: string;
  url: string;
  instructions: string[];
  variables?: Record<string, string>;
  state?: 'pending' | 'completed';
  error?: string;
  video?: string;
}
