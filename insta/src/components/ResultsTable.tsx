import { useState, useMemo } from 'react';
import { useApp } from '@/store';
import type { InstagramAccount } from '@/types';

interface ResultsTableProps {
  results: InstagramAccount[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'available' | 'high-score' | 'verified' | 'private'>('available');
  const [sortField, setSortField] = useState<keyof InstagramAccount>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    // Always filter by available linked email first - SHOW ONLY ACCOUNTS WITH AVAILABLE EMAILS
    filtered = filtered.filter(r => r.isLinkedEmailAvailable && r.linkedEmail);
    
    // Apply additional filters
    switch(filter) {
      case 'high-score':
        filtered = filtered.filter(r => r.score >= 70);
        break;
      case 'verified':
        filtered = filtered.filter(r => r.isVerified);
        break;
      case 'private':
        filtered = filtered.filter(r => r.isPrivate);
        break;
      case 'available':
      default:
        // Already filtered above - only available linked emails
        break;
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.username.toLowerCase().includes(term) ||
        (r.linkedEmail && r.linkedEmail.toLowerCase().includes(term)) ||
        (r.fullName && r.fullName.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'linkedEmail') {
        aValue = a.linkedEmail || '';
        bValue = b.linkedEmail || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [results, filter, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof InstagramAccount) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: keyof InstagramAccount) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreStars = (score: number) => {
    if (score >= 70) return '🔥🔥🔥';
    if (score >= 50) return '⭐⭐';
    if (score >= 30) return '⭐';
    return '💫';
  };

  const exportToCSV = () => {
    if (filteredResults.length === 0) {
      alert('No results to export!');
      return;
    }
    
    const headers = ['Username', 'Linked Email', 'Provider', 'Name', 'Followers', 'Following', 'Posts', 'Score', 'Verified', 'Private', 'Date Created'];
    const rows = filteredResults.map(r => [
      r.username,
      r.linkedEmail || '',
      r.linkedEmailProvider || '',
      r.fullName || '',
      r.followers || '0',
      r.following || '0',
      r.posts || '0',
      r.score,
      r.isVerified ? 'Yes' : 'No',
      r.isPrivate ? 'Yes' : 'No',
      r.createdDate || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_hunter_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    if (filteredResults.length === 0) {
      alert('No results to export!');
      return;
    }
    
    const data = {
      exported: new Date().toISOString(),
      total: filteredResults.length,
      results: filteredResults
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_hunter_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🎯 Found Accounts (Only Available Emails)
          <span className="text-sm font-normal text-gray-400">
            ({filteredResults.length} available)
          </span>
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            📄 Export CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            📊 Export JSON
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search by username, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="available">📧 Available Emails Only</option>
          <option value="high-score">🔥 High Score (70+)</option>
          <option value="verified">✅ Verified Accounts</option>
          <option value="private">🔒 Private Accounts</option>
        </select>
      </div>
      
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-400 text-lg">
            {state.stats.isRunning ? '🔍 Searching for accounts with available emails...' : 'No available emails found yet. Start hunting!'}
          </p>
          {state.stats.isRunning && (
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 text-gray-300 uppercase">
              <tr>
                <th 
                  onClick={() => handleSort('username')}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600"
                >
                  Username {getSortIcon('username')}
                </th>
                <th 
                  onClick={() => handleSort('linkedEmail')}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600"
                >
                  Linked Email {getSortIcon('linkedEmail')}
                </th>
                <th className="px-4 py-3 text-left">Provider</th>
                <th 
                  onClick={() => handleSort('fullName')}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600"
                >
                  Name {getSortIcon('fullName')}
                </th>
                <th 
                  onClick={() => handleSort('followers')}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600"
                >
                  Followers {getSortIcon('followers')}
                </th>
                <th 
                  onClick={() => handleSort('score')}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600"
                >
                  Score {getSortIcon('score')}
                </th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredResults.map((result, index) => (
                <tr key={`${result.username}-${index}`} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{result.username}</span>
                      {result.isVerified && <span className="text-blue-400" title="Verified">✓</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {result.linkedEmail ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium">{result.linkedEmail}</span>
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Available</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">
                      {result.linkedEmailProvider || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{result.fullName || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {(result.followers || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100 {getScoreStars(result.score)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {result.isVerified && <span className="text-blue-400" title="Verified">✓</span>}
                      {result.isPrivate ? (
                        <span className="text-yellow-400" title="Private">🔒</span>
                      ) : (
                        <span className="text-green-400" title="Public">🌐</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>Showing only Instagram accounts with available linked emails.</strong> 
          These are accounts that exist on Instagram but their email is not registered yet!
        </p>
      </div>
    </div>
  );
}