import { useState, useEffect, useCallback, useRef } from 'react'
import './index.css'

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

export { type TimerMode, type PomodoroSession, MODE_DURATIONS, MODE_LABELS, formatTime }

function App() {
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

  const todayWorkSessions = todaySessions.filter(s => s.mode === 'work')

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
    <div className="min-h-screen bg-surface-dim flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <span className="font-[Manrope] font-extrabold text-primary tracking-tighter text-lg">Temporal Sanctuary</span>
        </div>
        <div className="bg-gradient-to-b from-surface-container-low to-transparent h-px"></div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-center space-y-12 pt-20 pb-32 px-6 w-full max-w-lg">
        {/* Mode selector */}
        <div className="flex gap-3">
          {(['work', 'shortBreak', 'longBreak'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-5 py-2.5 rounded-full font-[Manrope] font-bold text-sm tracking-wider transition-all ${
                mode === m
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Timer Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full border border-primary/10 animate-pulse-ring"></div>
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
              <span className="font-[Manrope] text-6xl font-extrabold tracking-tight text-on-surface" data-testid="timer-display">
                {formatTime(timeLeft)}
              </span>
              <span className="font-[Inter] text-xs uppercase tracking-[0.3em] text-on-surface-variant/60 mt-2">
                {MODE_LABELS[mode]}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-all active:scale-95"
            aria-label="Sıfırla"
          >
            <span className="material-symbols-outlined">replay</span>
          </button>
          <button
            onClick={isRunning ? handlePause : handleStart}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            aria-label={isRunning ? 'Duraklat' : 'Başlat'}
          >
            <span className="material-symbols-outlined text-4xl">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            onClick={() => handleModeChange(mode === 'work' ? 'shortBreak' : 'work')}
            className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-all active:scale-95"
            aria-label="Sonraki"
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>

        {/* Daily Progress */}
        <div className="w-full bg-surface-container-low rounded-2xl p-6">
          <h3 className="font-[Manrope] font-bold text-sm uppercase tracking-widest text-on-surface-variant/60 mb-4">Günlük İlerleme</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-[Inter] text-on-surface font-semibold">{todayWorkSessions.length} pomodoro</span>
                <span className="font-[Inter] text-on-surface-variant text-sm">Hedef: 8</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todayWorkSessions.length / 8) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 w-full z-40 bg-surface-container-low/60 backdrop-blur-xl md:hidden">
        <div className="flex justify-around items-center px-4 pb-8 pt-4">
          <div className="flex flex-col items-center justify-center text-primary px-6 py-2">
            <span className="material-symbols-outlined mb-1">timer</span>
            <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest">Zamanlayıcı</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-40 px-6 py-2">
            <span className="material-symbols-outlined mb-1">bar_chart</span>
            <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest">İstatistikler</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-40 px-6 py-2">
            <span className="material-symbols-outlined mb-1">settings</span>
            <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest">Ayarlar</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
