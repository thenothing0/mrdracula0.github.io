import { useApp } from '@/store';
import { useEffect, useState } from 'react';

function getElapsedTime(startTime: number): string {
  if (!startTime) return '00:00';
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Header() {
  const { state } = useApp();
  const { stats } = state;
  const [displayTime, setDisplayTime] = useState('00:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stats.isRunning) {
      interval = setInterval(() => {
        setDisplayTime(getElapsedTime(stats.startTime));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stats.isRunning, stats.startTime]);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ⚡ Instagram Hunter v5.1
            </h1>
            <p className="mt-1 text-indigo-100">
              Advanced Instagram Account & Email Checker
            </p>
          </div>
          
          {stats.isRunning && (
            <div className="text-right">
              <div className="text-sm text-indigo-100">Elapsed Time</div>
              <div className="text-2xl font-bold">
                {displayTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}