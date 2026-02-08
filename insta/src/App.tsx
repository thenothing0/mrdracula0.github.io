import { AppProvider } from './store';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { ControlPanel } from './components/ControlPanel';
import ResultsTable from './components/ResultsTable';
import { TorProxyInfo } from './components/TorProxyInfo';
import { useApp } from './store';

function AppContent() {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsDashboard />
        <ControlPanel />
        <ResultsTable results={state.accounts} />
        <TorProxyInfo />
      </main>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
