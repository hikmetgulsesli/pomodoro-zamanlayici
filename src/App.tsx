import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'
import Settings from './Settings'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroSession {
  id: string
  mode: TimerMode
  duration: number
  completedAt: number
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Çalışma',
  shortBreak: 'Kısa Mola',
  longBreak: 'Uzun Mola',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// Navigation component
function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div className="font-[Manrope] font-extrabold text-[var(--color-primary)] tracking-tighter text-xl">
          Temporal Sanctuary
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`font-[Manrope] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/' 
                ? 'text-[var(--color-primary)]' 
                : 'text-[var(--color-on-surface-variant)] opacity-60 hover:bg-[var(--color-surface-container-high)]'
            }`}
          >
            Zamanlayıcı
          </Link>
          <Link
            to="/statistics"
            className={`font-[Manrope] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/statistics' 
                ? 'text-[var(--color-primary)]' 
                : 'text-[var(--color-on-surface-variant)] opacity-60 hover:bg-[var(--color-surface-container-high)]'
            }`}
          >
            İstatistikler
          </Link>
          <Link
            to="/settings"
            className={`font-[Manrope] font-bold tracking-tight text-lg px-3 py-1 rounded-lg transition-colors duration-300 ${
              currentPath === '/settings' 
                ? 'text-[var(--color-primary)]' 
                : 'text-[var(--color-on-surface-variant)] opacity-60 hover:bg-[var(--color-surface-container-high)]'
            }`}
          >
            Ayarlar
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="material-symbols-outlined text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] p-2 rounded-full transition-colors duration-300"
            aria-label="Profil"
          >
            account_circle
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent h-px"></div>
    </nav>
  )
}

// Bottom navigation for mobile
function BottomNavigation() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[var(--color-surface-container-low)]/60 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/' 
            ? 'bg-[var(--color-primary-container)]/15 text-[var(--color-primary)]' 
            : 'text-[var(--color-on-surface-variant)] opacity-40 hover:opacity-100 hover:bg-[var(--color-surface-container-high)]/40'
        }`}
      >
        <span className="material-symbols-outlined">timer</span>
        <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">Zamanlayıcı</span>
      </Link>
      <Link
        to="/statistics"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/statistics' 
            ? 'bg-[var(--color-primary-container)]/15 text-[var(--color-primary)]' 
            : 'text-[var(--color-on-surface-variant)] opacity-40 hover:opacity-100 hover:bg-[var(--color-surface-container-high)]/40'
        }`}
      >
        <span className="material-symbols-outlined">bar_chart</span>
        <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">İstatistikler</span>
      </Link>
      <Link
        to="/settings"
        className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all duration-500 ${
          currentPath === '/settings' 
            ? 'bg-[var(--color-primary-container)]/15 text-[var(--color-primary)]' 
            : 'text-[var(--color-on-surface-variant)] opacity-40 hover:opacity-100 hover:bg-[var(--color-surface-container-high)]/40'
        }`}
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">Ayarlar</span>
      </Link>
    </footer>
  )
}

function TimerPage() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.work)
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
                { id: crypto.randomUUID(), mode, duration: MODE_DURATIONS[mode], completedAt: Date.now() }
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
  }, [isRunning, mode])

  const handleStart = useCallback(() => setIsRunning(true), [])
  const handlePause = useCallback(() => setIsRunning(false), [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(MODE_DURATIONS[mode])
  }, [mode])

  const handleModeChange = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(MODE_DURATIONS[newMode])
  }, [])

  const progress = 1 - timeLeft / MODE_DURATIONS[mode]
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--color-surface-dim)]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[var(--color-primary)]/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-[var(--color-secondary)]/5 blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center space-y-12 pt-20 pb-32 px-6 w-full max-w-lg">
        {/* Mode selector */}
        <div className="flex gap-3">
          {(['work', 'shortBreak', 'longBreak'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-5 py-2.5 rounded-full font-[Manrope] font-bold text-sm tracking-wider transition-all ${
                mode === m
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)]'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Timer Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full border border-[var(--color-primary)]/10 animate-pulse"></div>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute w-64 h-64 -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="120" stroke="var(--color-surface-container-high)" strokeWidth="4" fill="none" />
              <circle
                cx="128" cy="128" r="120"
                stroke="var(--color-primary)" strokeWidth="4" fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="relative flex flex-col items-center justify-center">
              <span className="font-[Manrope] text-6xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
                {formatTime(timeLeft)}
              </span>
              <span className="font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--color-on-surface-variant)]/60 mt-2">
                {MODE_LABELS[mode]}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            className="w-14 h-14 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:bg-[var(--color-surface-container-highest)] transition-all active:scale-95"
            aria-label="Sıfırla"
          >
            <span className="material-symbols-outlined">replay</span>
          </button>
          <button
            onClick={isRunning ? handlePause : handleStart}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 hover:scale-105 active:scale-95 transition-all"
            aria-label={isRunning ? 'Duraklat' : 'Başlat'}
          >
            <span className="material-symbols-outlined text-4xl">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            onClick={() => handleModeChange(mode === 'work' ? 'shortBreak' : 'work')}
            className="w-14 h-14 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:bg-[var(--color-surface-container-highest)] transition-all active:scale-95"
            aria-label="Sonraki"
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>

        {/* Daily Progress */}
        <div className="w-full bg-[var(--color-surface-container-low)] rounded-2xl p-6">
          <h3 className="font-[Manrope] font-bold text-sm uppercase tracking-widest text-[var(--color-on-surface-variant)]/60 mb-4">Günlük İlerleme</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-[Inter] text-[var(--color-on-surface)] font-semibold">{todaySessions.length} pomodoro</span>
                <span className="font-[Inter] text-[var(--color-on-surface-variant)] text-sm">Hedef: 8</span>
              </div>
              <div className="h-2 bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todaySessions.length / 8) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatisticsPage() {
  return (
    <div className="min-h-screen pt-24 pb-32 px-6 bg-[var(--color-surface-dim)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-[Manrope] font-extrabold text-[var(--color-on-surface)] tracking-tight mb-8">İstatistikler</h1>
        <div className="bg-[var(--color-surface-container-low)] rounded-[32px] p-8 text-center">
          <p className="text-[var(--color-on-surface-variant)]">İstatistikler yakında eklenecek.</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-surface-dim)]">
        <Navigation />
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  )
}

export default App
