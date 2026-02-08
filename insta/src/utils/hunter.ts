import { Account, HunterState } from '../types/hunter';

// Simulate checking if email is available
const checkEmailAvailability = async (_email: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  // In real implementation, this would check Microsoft/Yahoo/Google APIs
  // For simulation: 70% chance email is available
  return Math.random() > 0.3;
};

// Simulate checking if email has Instagram account
const checkInstagramForEmail = async (emailParam: string): Promise<{
  hasAccount: boolean;
  username?: string;
  fullName?: string;
  followers?: number;
  following?: number;
  posts?: number;
  pk?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
  
  // In real implementation, this would use Instagram's recovery APIs
  // For simulation: 75% chance email has Instagram account (increased from 60%)
  if (Math.random() > 0.25) {
    const usernamePrefix = emailParam.split('@')[0];
    
    // Clean username - remove special chars and ensure it's valid
    const cleanUsername = usernamePrefix.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    const finalUsername = cleanUsername || 'user';
    
    // Add numbers sometimes to make it more realistic
    const username = Math.random() > 0.6 ? 
      finalUsername + Math.floor(Math.random() * 999) : 
      finalUsername;
    
    // Simulate finding Instagram account details - SUCCESS CASE
    return {
      hasAccount: true,
      username: username,
      fullName: generateRandomName(),
      followers: Math.floor(Math.random() * 50000) + 100,
      isVerified: Math.random() > 0.9, // Reduced verification rate for realism
      isPrivate: Math.random() > 0.6
    };
  }
  
  // Email is available but has no Instagram account
  return { hasAccount: false };
};

// Generate random name for simulation
const generateRandomName = (): string => {
  const names = [
    'أحمد', 'محمد', 'علي', 'عمر', 'سارة', 'فاطمة', 'حسن', 'يوسف', 'نور', 'ليلى',
    'John', 'Mike', 'Alex', 'Chris', 'David', 'Maria', 'Anna', 'Emma', 'Lisa', 'Kate',
    'Cool User', 'Dark Knight', 'Star Light', 'Moon Shadow', 'Fire Blaze'
  ];
  return names[Math.floor(Math.random() * names.length)];
};

// Calculate account score
export const calculateScore = (
  followers: number,
  createdDate: string,
  isVerified: boolean,
  isPrivate: boolean
): number => {
  let score = 0;
  
  // Followers score
  if (followers > 100000) score += 30;
  else if (followers > 10000) score += 25;
  else if (followers > 1000) score += 20;
  else if (followers > 100) score += 10;
  else if (followers > 0) score += 5;
  
  // Account age score
  const ageScores: Record<string, number> = {
    '2010': 25, '2011': 25, '2012': 23, '2013': 22, '2014': 20,
    '2015': 18, '2016': 15, '2017': 12, '2018': 10, '2019': 8,
    '2020': 5, '2021': 3, '2022': 2, '2023': 1
  };
  score += ageScores[createdDate] || 0;
  
  // Verification bonus
  if (isVerified) score += 10;
  
  // Public account bonus
  if (!isPrivate) score += 3;
  
  return Math.min(score, 100);
};

// Get account creation date from ID
export const getDateFromId = (pk?: string | number): string => {
  if (!pk) return '?';
  try {
    const id = typeof pk === 'string' ? parseInt(pk) : pk;
    const thresholds: Array<[number, string]> = [
      [1279000, '2010'], [17750000, '2011'], [279760000, '2012'],
      [900990000, '2013'], [1629010000, '2014'], [2500000000, '2015'],
      [3713668786, '2016'], [5699785217, '2017'], [8507940634, '2018'],
      [21254029834, '2019'], [32000000000, '2020'], [42000000000, '2021'],
      [52000000000, '2022'], [62000000000, '2023'], [75000000000, '2024']
    ];
    
    for (const [threshold, year] of thresholds) {
      if (id < threshold) return year;
    }
    return '2024+';
  } catch {
    return '?';
  }
};

// Send Telegram notification
export const sendToTelegram = async (
  token: string,
  chatId: string,
  account: Account
): Promise<boolean> => {
  try {
    const score = account.score || 0;
    const stars = score >= 70 ? '🔥🔥🔥' : score >= 50 ? '⭐⭐' : score >= 30 ? '⭐' : '💫';
    const verified = account.isVerified ? ' ✓' : '';
    
    const message = `✅ صيدة جديدة${verified}
◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉
📝 الاسم: ${account.fullName || 'بدون اسم'}
👤 اليوزر: ${account.username}
📧 الايميل: ${account.linkedEmail} ✅ متاح
👥 المتابعين: ${account.followers || 0}
🆔 الايدي: ${account.pk || '?'}
📅 التاريخ: ${account.createdDate || '?'}
◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉
⭐ ${score}/100 ${stars}
🔗 instagram.com/${account.username}
⏰ ${new Date().toLocaleTimeString('ar-EG')} | @A_fkf7`;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
};

// Process a single email
export const processEmail = async (
  email: string,
  state: HunterState,
  dispatch: React.Dispatch<any>
): Promise<void> => {
  if (!state.isProcessing) return;
  
  // Check if email is available
  const isAvailable = await checkEmailAvailability(email);
  if (!isAvailable) {
    // Email is taken, skip
    dispatch({ type: 'UPDATE_STATS', payload: { badEmails: state.stats.badEmails + 1 } });
    return;
  }
  
  // Email is available, check if it has Instagram account
  const instaResult = await checkInstagramForEmail(email);
  if (!instaResult.hasAccount) {
    // No Instagram account linked, skip
    dispatch({ type: 'UPDATE_STATS', payload: { 
      goodEmails: state.stats.goodEmails + 1,
      badInstagram: state.stats.badInstagram + 1 
    }});
    return;
  }
  
  // SUCCESS: Email is available AND has Instagram account!
  const createdDate = getDateFromId(instaResult.pk);
  const score = calculateScore(
    instaResult.followers || 0,
    createdDate,
    instaResult.isVerified || false,
    instaResult.isPrivate || false
  );
  
  const account: Account = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    username: instaResult.username || email.split('@')[0],
    fullName: instaResult.fullName || 'بدون اسم',
    followers: instaResult.followers || 0,
    following: instaResult.following || 0,
    posts: instaResult.posts || 0,
    pk: instaResult.pk || Date.now().toString(),
    createdDate,
    isPrivate: instaResult.isPrivate || false,
    isVerified: instaResult.isVerified || false,
    score,
    linkedEmail: email,
    linkedEmailProvider: email.split('@')[1] as any,
    isLinkedEmailAvailable: true,
    foundAt: new Date().toISOString()
  };
  
  // Add to results
  dispatch({
    type: 'ADD_ACCOUNT',
    payload: account
  });
  
  // Update stats
  dispatch({
    type: 'UPDATE_STATS',
    payload: {
      goodEmails: state.stats.goodEmails + 1,
      goodInstagram: state.stats.goodInstagram + 1,
      foundAccounts: state.stats.foundAccounts + 1,
      totalScore: state.stats.totalScore + score
    }
  });
  
  // Update best account
  if (score > state.stats.bestScore) {
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        bestAccount: account.username,
        bestScore: score
      }
    });
  }
  
  // Send Telegram notification if enabled
  if (state.settings.sendToTelegram && state.settings.telegramToken && state.settings.telegramChatId) {
    await sendToTelegram(state.settings.telegramToken, state.settings.telegramChatId, account);
  }
  
  // Save to file
  try {
    const existing = JSON.parse(localStorage.getItem('found_emails') || '[]');
    existing.push({
      email: account.linkedEmail,
      username: account.username,
      score: account.score,
      followers: account.followers,
      createdDate: account.createdDate,
      foundAt: account.foundAt
    });
    localStorage.setItem('found_emails', JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Worker functions
export const emailWorker = async (state: HunterState, dispatch: React.Dispatch<any>) => {
  const providers = ['hotmail.com', 'outlook.com', 'yahoo.com', 'gmail.com'];
  const names = [
    'ahmed', 'mohamed', 'ali', 'omar', 'sara', 'fatima', 'hassan', 'youssef', 'nour', 'layla',
    'john', 'mike', 'alex', 'chris', 'david', 'maria', 'anna', 'emma', 'lisa', 'kate',
    'cool', 'dark', 'king', 'queen', 'star', 'moon', 'sun', 'fire', 'ice', 'love'
  ];
  
  while (state.isProcessing) {
    try {
      // Generate random email
      const name = names[Math.floor(Math.random() * names.length)];
      const number = Math.random() > 0.5 ? Math.floor(Math.random() * 999) : '';
      const provider = providers[Math.floor(Math.random() * providers.length)];
      const email = `${name}${number}@${provider}`;
      
      await processEmail(email, state, dispatch);
      
      // Random delay to simulate realistic timing
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    } catch (error) {
      console.error('Worker error:', error);
      dispatch({
        type: 'UPDATE_STATS',
        payload: { errors: state.stats.errors + 1 }
      });
    }
  }
};

// List worker for processing emails from list
export const listEmailWorker = async (
  emails: string[],
  state: HunterState,
  dispatch: React.Dispatch<any>
) => {
  for (const email of emails) {
    if (!state.isProcessing) break;
    
    try {
      await processEmail(email, state, dispatch);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    } catch (error) {
      console.error('List worker error:', error);
      dispatch({
        type: 'UPDATE_STATS',
        payload: { errors: state.stats.errors + 1 }
      });
    }
  }
};