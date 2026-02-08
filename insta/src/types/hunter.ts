export interface Account {
  id: string;
  username: string;
  fullName?: string;
  followers: number;
  following: number;
  posts: number;
  pk?: string;
  createdDate?: string;
  isPrivate: boolean;
  isVerified: boolean;
  score: number;
  linkedEmail: string;
  linkedEmailProvider: 'hotmail.com' | 'outlook.com' | 'yahoo.com' | 'gmail.com' | string;
  isLinkedEmailAvailable: boolean;
  foundAt: string;
}

export interface Stats {
  checks: number;
  goodEmails: number;
  badEmails: number;
  goodInstagram: number;
  badInstagram: number;
  foundAccounts: number;
  errors: number;
  totalScore: number;
  bestAccount?: string;
  bestScore: number;
  startTime: number;
}

export interface Settings {
  threadCount: number;
  minScore: number;
  sendToTelegram: boolean;
  telegramToken: string;
  telegramChatId: string;
  checkEmailProviders: string[];
  useProxies: boolean;
  proxyList: string[];
}

export interface HunterState {
  isProcessing: boolean;
  stats: Stats;
  accounts: Account[];
  settings: Settings;
}

export type HunterAction =
  | { type: 'START_HUNTING' }
  | { type: 'STOP_HUNTING' }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_STATS'; payload: Partial<Stats> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'LOAD_STATE'; payload: HunterState };