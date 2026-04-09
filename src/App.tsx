import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { SettingsProvider } from './SettingsContext';
import Settings from './Settings';
import EmptyState from './EmptyState';
import './App.css';

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="font-headline font-extrabold text-primary tracking-tighter text-xl">
          Temporal Sanctuary
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`font-headline font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/' 
                ? 'text-primary' 
                : 'text-on-surface-variant opacity-60 hover:bg-surface-container-high'
            }`}
          >
            Zamanlayıcı
          </Link>
          <Link
            to="/empty"
            className={`font-headline font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/empty' 
                ? 'text-primary' 
                : 'text-on-surface-variant opacity-60 hover:bg-surface-container-high'
            }`}
          >
            Boş Durum
          </Link>
          <Link
            to="/settings"
            className={`font-headline font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/settings' 
                ? 'text-primary' 
                : 'text-on-surface-variant opacity-60 hover:bg-surface-container-high'
            }`}
          >
            Ayarlar
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="material-symbols-outlined text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors duration-300"
            aria-label="Profil"
          >
            account_circle
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-b from-surface-container-low to-transparent h-px w-full"></div>
    </nav>
  );
}

function BottomNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-container-low/60 backdrop-blur-xl rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/' 
            ? 'bg-primary-container/15 text-primary' 
            : 'text-on-surface-variant opacity-40 hover:opacity-100 hover:bg-surface-container-high/40'
        }`}
      >
        <span className="material-symbols-outlined">timer</span>
        <span className="font-body text-[10px] font-medium uppercase tracking-widest mt-1">Zamanlayıcı</span>
      </Link>
      <Link
        to="/empty"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/empty' 
            ? 'bg-primary-container/15 text-primary' 
            : 'text-on-surface-variant opacity-40 hover:opacity-100 hover:bg-surface-container-high/40'
        }`}
      >
        <span className="material-symbols-outlined">hourglass_empty</span>
        <span className="font-body text-[10px] font-medium uppercase tracking-widest mt-1">Boş</span>
      </Link>
      <Link
        to="/settings"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/settings' 
            ? 'bg-primary-container/15 text-primary' 
            : 'text-on-surface-variant opacity-40 hover:opacity-100 hover:bg-surface-container-high/40'
        }`}
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="font-body text-[10px] font-medium uppercase tracking-widest mt-1">Ayarlar</span>
      </Link>
    </footer>
  );
}

function TimerPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center pt-24 pb-32 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold text-on-surface mb-4">Zamanlayıcı</h1>
        <p className="text-on-surface-variant">Pomodoro zamanlayıcı burada olacak.</p>
        <Link to="/settings" className="inline-block mt-8 px-8 py-4 bg-primary text-on-primary rounded-full font-bold hover:scale-105 transition-transform">
          Ayarlara Git
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/empty" element={<EmptyState />} />
        </Routes>
        <BottomNavigation />
      </div>
    </SettingsProvider>
  );
}

export default App;
