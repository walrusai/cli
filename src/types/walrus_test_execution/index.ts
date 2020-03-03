export interface WalrusTestExecution {
  success: boolean;
  name: string;
  error?: string;
  data?: { video: string };
}
