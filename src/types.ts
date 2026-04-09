// Types for Pomodoro Timer
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type Theme = 'dark' | 'light';
export type SoundType = 'zen' | 'digital' | 'piano' | 'nature';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export interface SoundSettings {
  soundType: SoundType;
  volume: number;
}

export interface AppSettings {
  timer: TimerSettings;
  theme: Theme;
  sound: SoundSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  timer: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
  theme: 'dark',
  sound: {
    soundType: 'zen',
    volume: 75,
  },
};

export const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Çalışma',
  shortBreak: 'Kısa Mola',
  longBreak: 'Uzun Mola',
};

export const SOUND_LABELS: Record<SoundType, string> = {
  zen: 'Zen Bowl (Varsayılan)',
  digital: 'Dijital Bip',
  piano: 'Yumuşak Piyano',
  nature: 'Doğa Sesleri',
};

export function formatTime(minutes: number): string {
  return `${minutes} Dakika`;
}
