import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Settings from './Settings'
import Statistics from './Statistics'
import { type TimerMode, type PomodoroSession, type TimerSettings, MODE_LABELS, formatTime, DEFAULT_SETTINGS } from './types'

// Navigation component
function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="font-['Manrope'] font-extrabold text-[#FFB5A0] tracking-tighter text-xl">
          Temporal Sanctuary
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`font-['Manrope'] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/' 
                ? 'text-[#FFB5A0]' 
                : 'text-[#E4BEB4] opacity-60 hover:bg-[#2A2A2A]'
            }`}
          >
            Zamanlayıcı
          </Link>
          <Link
            to="/statistics"
            className={`font-['Manrope'] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/statistics' 
                ? 'text-[#FFB5A0]' 
                : 'text-[#E4BEB4] opacity-60 hover:bg-[#2A2A2A]'
            }`}
          >
            İstatistikler
          </Link>
          <Link
            to="/settings"
            className={`font-['Manrope'] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/settings' 
                ? 'text-[#FFB5A0]' 
                : 'text-[#E4BEB4] opacity-60 hover:bg-[#2A2A2A]'
            }`}
          >
            Ayarlar
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="material-symbols-outlined text-[#FFB5A0] hover:bg-[#2A2A2A] p-2 rounded-full transition-colors duration-300"
            aria-label="Profil"
          >
            account_circle
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#1C1B1B] to-transparent h-px w-full"></div>
    </nav>
  )
}

// Bottom navigation for mobile
function BottomNavigation() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#1C1B1B]/60 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/' 
            ? 'bg-[#FC5929]/15 text-[#FFB5A0]' 
            : 'text-[#E4BEB4] opacity-40 hover:opacity-100 hover:bg-[#2A2A2A]/40'
        }`}
      >
        <span className="material-symbols-outlined">timer</span>
        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Zamanlayıcı</span>
      </Link>
      <Link
        to="/statistics"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/statistics' 
            ? 'bg-[#FC5929]/15 text-[#FFB5A0]' 
            : 'text-[#E4BEB4] opacity-40 hover:opacity-100 hover:bg-[#2A2A2A]/40'
        }`}
      >
        <span className="material-symbols-outlined">bar_chart</span>
        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">İstatistikler</span>
      </Link>
      <Link
        to="/settings"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/settings' 
            ? 'bg-[#FC5929]/15 text-[#FFB5A0]' 
            : 'text-[#E4BEB4] opacity-40 hover:opacity-100 hover:bg-[#2A2A2A]/40'
        }`}
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="font-['Inter'] text-[10px] font-medium uppercase tracking-widest mt-1">Ayarlar</span>
      </Link>
    </footer>
  )
}

// Timer Page Component
function TimerPage({ settings }: { settings: TimerSettings }) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState<PomodoroSession[]>(() => {
    try {
      const saved = localStorage.getItem('pomodoro-sessions')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const todaySessions = completedPomodoros.filter(s => {
    const d = new Date(s.completedAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const todayWorkSessions = todaySessions.filter(s => s.mode === 'work')

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning) {
      const duration = mode === 'work' ? settings.workDuration : 
                      mode === 'shortBreak' ? settings.shortBreakDuration : 
                      settings.longBreakDuration
      // Use requestAnimationFrame to avoid synchronous setState
      requestAnimationFrame(() => {
        setTimeLeft(duration * 60)
      })
    }
  }, [settings, mode, isRunning])

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro-sessions', JSON.stringify(completedPomodoros))
    } catch {
      // localStorage not available
    }
  }, [completedPomodoros])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if (mode === 'work') {
              setCompletedPomodoros(prevSessions => [
                ...prevSessions,
                { id: crypto.randomUUID(), mode, duration: settings.workDuration * 60, completedAt: Date.now() }
              ])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode, settings.workDuration])

  const handleStart = useCallback(() => setIsRunning(true), [])
  const handlePause = useCallback(() => setIsRunning(false), [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    const duration = mode === 'work' ? settings.workDuration : 
                    mode === 'shortBreak' ? settings.shortBreakDuration : 
                    settings.longBreakDuration
    setTimeLeft(duration * 60)
  }, [mode, settings])

  const handleModeChange = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    const duration = newMode === 'work' ? settings.workDuration : 
                    newMode === 'shortBreak' ? settings.shortBreakDuration : 
                    settings.longBreakDuration
    setTimeLeft(duration * 60)
  }, [settings])

  const progress = 1 - timeLeft / ((mode === 'work' ? settings.workDuration : 
                                   mode === 'shortBreak' ? settings.shortBreakDuration : 
                                   settings.longBreakDuration) * 60)
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/5 blur-[100px] rounded-full"></div>
      
      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-6 py-2.5 rounded-xl font-['Manrope'] font-bold text-sm transition-all duration-300 ${
              mode === m
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative mb-8">
        <div className="w-72 h-72 md:w-80 md:h-80 relative">
          <svg className="w-full h-full progress-ring" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="var(--color-surface-container-highest)"
              strokeWidth="8"
            />
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeLinecap="round"
              className="progress-ring-circle"
              style={{ strokeDasharray: circumference, strokeDashoffset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-['Manrope'] font-bold text-on-surface tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className="text-on-surface-variant mt-2 font-medium">
              {MODE_LABELS[mode]}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleReset}
          className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
          aria-label="Sıfırla"
        >
          <span className="material-symbols-outlined">replay</span>
        </button>
        <button
          onClick={isRunning ? handlePause : handleStart}
          className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_32px_rgba(252,89,41,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label={isRunning ? 'Durdur' : 'Başlat'}
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <button
          className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
          aria-label="Ayarlar"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* Today's Progress */}
      <div className="text-center">
        <p className="text-on-surface-variant text-sm mb-2">Bugün Tamamlanan</p>
        <div className="flex items-center gap-2 justify-center">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-2xl font-['Manrope'] font-bold text-on-surface">
            {todayWorkSessions.length}
          </span>
          <span className="text-on-surface-variant">pomodoro</span>
        </div>
      </div>
    </main>
  )
}

function App() {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const saved = localStorage.getItem('pomodoro-settings')
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      // localStorage not available
    }
    return DEFAULT_SETTINGS
  })

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
    } catch {
      // localStorage not available
    }
  }, [settings])

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Navigation />
      <Routes>
        <Route path="/" element={<TimerPage settings={settings} />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings settings={settings} onSettingsChange={setSettings} />} />
      </Routes>
      <BottomNavigation />
    </div>
  )
}

export default App