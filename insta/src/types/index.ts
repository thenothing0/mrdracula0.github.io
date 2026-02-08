export interface InstagramAccount {
  id: string;
  username: string;
  fullName: string;
  followers: number;
  following: number;
  posts: number;
  isPrivate: boolean;
  isVerified: boolean;
  profilePic?: string;
  bio?: string;
  externalUrl?: string;
  createdDate?: string;
  linkedEmail: string;
  linkedEmailProvider: 'hotmail' | 'outlook' | 'yahoo' | 'gmail' | null;
  isLinkedEmailAvailable: boolean;
  score: number;
  checkedAt: string;
  status: 'available' | 'taken' | 'checking' | 'error';
}

export interface Stats {
  totalChecked: number;
  available: number;
  instagramFound: number;
  instagramNotFound: number;
  fetchSuccess: number;
  fetchErrors: number;
  yahooFound: number;
  outlookFound: number;
  gmailFound: number;
  totalScore: number;
  bestAccount: string | null;
  bestScore: number;
  startTime: number | null;
  isRunning: boolean;
}

export interface Settings {
  emailType: 'hotmail' | 'outlook' | 'yahoo' | 'all';
  checkExtra: boolean;
  minFollowers: number;
  useProxy: boolean;
  proxyUrl?: string;
  autoFetch: boolean;
  fetchMethod: 'graphql' | 'api' | 'search' | 'followers' | 'all';
  idRange: '1' | '2' | '3' | '4' | '5' | '6';
  threadCount: number;
  telegramToken?: string;
  telegramChatId?: string;
  sendToTelegram: boolean;
}

export interface FetchSource {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  successRate: number;
}
