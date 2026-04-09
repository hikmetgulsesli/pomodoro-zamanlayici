export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroSession {
  id: string
  mode: TimerMode
  duration: number
  completedAt: number
}

export interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  soundEnabled: boolean
  soundVolume: number
  soundType: 'zen' | 'digital' | 'piano' | 'nature'
  theme: 'dark' | 'light' | 'auto'
}

export const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Çalışma',
  shortBreak: 'Kısa Mola',
  longBreak: 'Uzun Mola',
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dk`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} sa`
  }
  return `${hours} sa ${remainingMinutes} dk`
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  soundVolume: 75,
  soundType: 'zen',
  theme: 'dark',
}