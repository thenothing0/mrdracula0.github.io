import { useApp } from '@/store';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function StatsDashboard() {
  const { state } = useApp();
  const { stats } = state;

  // Update stats to match new email-based hunting logic
  const statCards = [
    {
      label: 'Emails Checked',
      value: formatNumber(stats.checks || 0),
      icon: '🔍',
      color: 'bg-blue-500',
    },
    {
      label: 'Available Emails',
      value: formatNumber(stats.goodEmails || 0),
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      label: 'Total Found',
      value: formatNumber(stats.foundAccounts || 0),
      icon: '🎯',
      color: 'bg-purple-500',
    },
    {
      label: 'No Instagram',
      value: formatNumber(stats.badInstagram || 0),
      icon: '❌',
      color: 'bg-red-500',
    },
    {
      label: 'Taken Emails',
      value: formatNumber(stats.badEmails || 0),
      icon: '✗',
      color: 'bg-gray-500',
    },
    {
      label: 'Total Score',
      value: formatNumber(stats.totalScore || 0),
      icon: '⭐',
      color: 'bg-yellow-500',
    },
    {
      label: 'Errors',
      value: formatNumber(stats.errors || 0),
      icon: '⚠️',
      color: 'bg-orange-500',
    },
    {
      label: 'Best Score',
      value: formatNumber(stats.bestScore || 0),
      icon: '🏆',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        📊 Real-time Statistics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div
                className={`${card.color} bg-opacity-10 p-2 rounded-lg`}
              >
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.bestAccount && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">🏆 Best Account</p>
              <p className="text-lg font-bold text-yellow-900">{stats.bestAccount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-700 font-medium">Score</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.bestScore}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}