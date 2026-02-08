import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { InstagramAccount, Stats, Settings, FetchSource } from '@/types';

interface AppState {
  accounts: InstagramAccount[];
  stats: Stats;
  settings: Settings;
  sources: FetchSource[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'ADD_ACCOUNT'; payload: InstagramAccount }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<InstagramAccount> } }
  | { type: 'SET_ACCOUNTS'; payload: InstagramAccount[] }
  | { type: 'UPDATE_STATS'; payload: Partial<Stats> }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATS' }
  | { type: 'CLEAR_ACCOUNTS' };

const initialState: AppState = {
  accounts: [],
  stats: {
    totalChecked: 0,
    available: 0,
    instagramFound: 0,
    instagramNotFound: 0,
    fetchSuccess: 0,
    fetchErrors: 0,
    yahooFound: 0,
    outlookFound: 0,
    gmailFound: 0,
    totalScore: 0,
    bestAccount: null,
    bestScore: 0,
    startTime: null,
    isRunning: false,
  },
  settings: {
    emailType: 'hotmail',
    checkExtra: false,
    minFollowers: 0,
    useProxy: false,
    autoFetch: true,
    fetchMethod: 'all',
    idRange: '6',
    threadCount: 5,
    sendToTelegram: false,
  },
  sources: [
    { id: 'graphql', name: 'GraphQL API', description: 'Fetch from Instagram GraphQL', isActive: true, successRate: 85 },
    { id: 'api', name: 'Instagram API', description: 'Fetch from Instagram API', isActive: true, successRate: 78 },
    { id: 'search', name: 'Search', description: 'Search for random usernames', isActive: true, successRate: 65 },
    { id: 'followers', name: 'Followers', description: 'Fetch from famous accounts', isActive: true, successRate: 72 },
  ],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: [action.payload, ...state.accounts],
      };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(acc =>
          acc.id === action.payload.id
            ? { ...acc, ...action.payload.updates }
            : acc
        ),
      };
    case 'SET_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload,
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'RESET_STATS':
      return {
        ...state,
        stats: {
          ...initialState.stats,
          startTime: Date.now(),
          isRunning: true,
        },
      };
    case 'CLEAR_ACCOUNTS':
      return {
        ...state,
        accounts: [],
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hunterData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.accounts) dispatch({ type: 'SET_ACCOUNTS', payload: data.accounts });
        if (data.settings) dispatch({ type: 'SET_SETTINGS', payload: data.settings });
        if (data.stats) dispatch({ type: 'UPDATE_STATS', payload: data.stats });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const data = {
        accounts: state.accounts,
        settings: state.settings,
        stats: state.stats,
      };
      localStorage.setItem('hunterData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [state.accounts, state.settings, state.stats]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
