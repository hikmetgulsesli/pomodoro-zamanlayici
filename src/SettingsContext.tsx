import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type AppSettings, DEFAULT_SETTINGS } from './types';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateTimerSettings: (timer: Partial<AppSettings['timer']>) => void;
  updateSoundSettings: (sound: Partial<AppSettings['sound']>) => void;
  setTheme: (theme: AppSettings['theme']) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // localStorage not available
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage not available
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateTimerSettings = (timer: Partial<AppSettings['timer']>) => {
    setSettings((prev) => ({
      ...prev,
      timer: { ...prev.timer, ...timer },
    }));
  };

  const updateSoundSettings = (sound: Partial<AppSettings['sound']>) => {
    setSettings((prev) => ({
      ...prev,
      sound: { ...prev.sound, ...sound },
    }));
  };

  const setTheme = (theme: AppSettings['theme']) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateTimerSettings,
        updateSoundSettings,
        setTheme,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
