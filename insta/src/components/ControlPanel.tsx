import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/store';
import { Settings } from '@/types';
import { processUsername, fetchUsernameGraphQL, fetchUsernameAPI, fetchUsernamesSearch, fetchUsernamesFollowers } from '@/utils/hunter';

export function ControlPanel() {
  const { state, dispatch } = useApp();
  const { settings } = state;
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const [status, setStatus] = useState('Ready');
  const [progress, setProgress] = useState(0);

  // Sync ref with state
  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  const startHunting = async () => {
    setIsProcessing(true);
    isProcessingRef.current = true;
    dispatch({ type: 'UPDATE_STATS', payload: { isRunning: true, startTime: Date.now() } });
    setStatus('🔄 Starting hunting process...');

    try {
      // Start multiple concurrent workers
      const workers = [];
      for (let i = 0; i < settings.threadCount; i++) {
        workers.push(runWorker(i));
      }

      await Promise.all(workers);
    } catch (error) {
      console.error('Hunting error:', error);
      setStatus('❌ Error occurred');
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
      dispatch({ type: 'UPDATE_STATS', payload: { isRunning: false } });
      setStatus('✅ Hunting completed');
    }
  };

  const runWorker = async (workerId: number) => {
    const methods = [
      { name: 'GraphQL', func: fetchUsernameGraphQL },
      { name: 'API', func: fetchUsernameAPI },
      { name: 'Search', func: fetchUsernamesSearch },
      { name: 'Followers', func: fetchUsernamesFollowers },
    ];

    while (isProcessingRef.current) {
      try {
        // Select method based on settings
        let usernames: string[] = [];
        
        if (settings.fetchMethod === 'all') {
          const method = methods[workerId % methods.length];
          setStatus(`[Worker ${workerId}] Using ${method.name}...`);
          const result = await method.func();
          usernames = typeof result === 'string' ? [result] : result || [];
        } else {
          const method = methods.find(m => m.name.toLowerCase() === settings.fetchMethod);
          if (method) {
            setStatus(`[Worker ${workerId}] Using ${method.name}...`);
            const result = await method.func();
            usernames = typeof result === 'string' ? [result] : result || [];
          }
        }

        // Process each username
        for (const username of usernames) {
          if (!isProcessingRef.current) break;

          setStatus(`[Worker ${workerId}] Processing ${username}...`);
          const account = await processUsername(username, settings, (msg) => {
            setStatus(`[Worker ${workerId}] ${msg}`);
          });

          if (account) {
            dispatch({ type: 'ADD_ACCOUNT', payload: account });
            
            // Update stats
            dispatch({
              type: 'UPDATE_STATS',
              payload: {
                totalChecked: state.stats.totalChecked + 1,
                available: state.stats.available + 1,
                instagramFound: state.stats.instagramFound + 1,
                totalScore: state.stats.totalScore + account.score,
                ...(account.score > state.stats.bestScore ? {
                  bestAccount: account.username,
                  bestScore: account.score,
                } : {}),
              },
            });

            // Update email stats based on linked email provider
            if (account.isLinkedEmailAvailable) {
              const provider = account.linkedEmailProvider;
              if (provider === 'yahoo') {
                dispatch({ type: 'UPDATE_STATS', payload: { yahooFound: state.stats.yahooFound + 1 } });
              } else if (provider === 'outlook') {
                dispatch({ type: 'UPDATE_STATS', payload: { outlookFound: state.stats.outlookFound + 1 } });
              } else if (provider === 'gmail') {
                dispatch({ type: 'UPDATE_STATS', payload: { gmailFound: state.stats.gmailFound + 1 } });
              }
            }
          } else {
            dispatch({
              type: 'UPDATE_STATS',
              payload: {
                totalChecked: state.stats.totalChecked + 1,
                instagramNotFound: state.stats.instagramNotFound + 1,
              },
            });
          }

          // Small delay between processing
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Update progress
        setProgress(prev => Math.min(prev + 1, 100));

        // Wait before next fetch
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      } catch (error) {
        console.error(`Worker ${workerId} error:`, error);
        dispatch({ type: 'UPDATE_STATS', payload: { fetchErrors: state.stats.fetchErrors + 1 } });
      }
    }
  };

  const stopHunting = () => {
    setIsProcessing(false);
    isProcessingRef.current = false;
    dispatch({ type: 'UPDATE_STATS', payload: { isRunning: false } });
    setStatus('🛑 Stopped');
  };

  const clearResults = () => {
    dispatch({ type: 'CLEAR_ACCOUNTS' });
    dispatch({ type: 'RESET_STATS' });
    setProgress(0);
    setStatus('🗑️ Results cleared');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        🎛️ Control Panel
      </h2>

      {/* Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-gray-900">{status}</p>
          </div>
          {isProcessing && (
            <div className="text-right">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 ml-auto"></div>
              <p className="text-sm text-gray-500 mt-1">{progress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={startHunting}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessing ? '🔄 Running...' : '🚀 Start Hunting'}
        </button>
        
        <button
          onClick={stopHunting}
          disabled={!isProcessing}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          🛑 Stop
        </button>
        
        <button
          onClick={clearResults}
          disabled={isProcessing}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">⚙️ Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={settings.emailType}
              onChange={(e) => updateSetting('emailType', e.target.value as any)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="hotmail">Hotmail</option>
              <option value="outlook">Outlook</option>
              <option value="yahoo">Yahoo</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Fetch Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fetch Method
            </label>
            <select
              value={settings.fetchMethod}
              onChange={(e) => updateSetting('fetchMethod', e.target.value as any)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="all">All Methods</option>
              <option value="graphql">GraphQL</option>
              <option value="api">Instagram API</option>
              <option value="search">Search</option>
              <option value="followers">Followers</option>
            </select>
          </div>

          {/* Thread Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threads ({settings.threadCount})
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.threadCount}
              onChange={(e) => updateSetting('threadCount', parseInt(e.target.value))}
              disabled={isProcessing}
              className="w-full"
            />
          </div>

          {/* Min Followers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Followers
            </label>
            <input
              type="number"
              min="0"
              value={settings.minFollowers}
              onChange={(e) => updateSetting('minFollowers', parseInt(e.target.value) || 0)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.checkExtra}
              onChange={(e) => updateSetting('checkExtra', e.target.checked)}
              disabled={isProcessing}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Check all email providers (Hotmail, Outlook, Yahoo, Gmail)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sendToTelegram}
              onChange={(e) => updateSetting('sendToTelegram', e.target.checked)}
              disabled={isProcessing}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Send results to Telegram
            </span>
          </label>
        </div>

        {/* Telegram Settings */}
        {settings.sendToTelegram && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <input
              type="text"
              placeholder="Telegram Bot Token"
              value={settings.telegramToken || ''}
              onChange={(e) => updateSetting('telegramToken', e.target.value)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
            <input
              type="text"
              placeholder="Telegram Chat ID"
              value={settings.telegramChatId || ''}
              onChange={(e) => updateSetting('telegramChatId', e.target.value)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}