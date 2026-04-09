import { useState, useEffect } from 'react'
import './index.css'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'
type Theme = 'dark' | 'light'

interface Settings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  theme: Theme
  soundEnabled: boolean
  soundVolume: number
  autoStartBreaks: boolean
}

interface PomodoroSession {
  id: string
  mode: TimerMode
  duration: number
  completedAt: number
}

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  theme: 'dark',
  soundEnabled: true,
  soundVolume: 75,
  autoStartBreaks: false,
}

function Settings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('pomodoro-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [showSaveToast, setShowSaveToast] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pomodoro-sessions')
      if (saved) {
        setSessions(JSON.parse(saved))
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const saveSettings = () => {
    try {
      localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
      setShowSaveToast(true)
      setTimeout(() => setShowSaveToast(false), 2000)
    } catch {
      // localStorage not available
    }
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const totalWorkMinutes = sessions
    .filter(s => s.mode === 'work')
    .reduce((acc, s) => acc + s.duration, 0)

  const totalBreakMinutes = sessions
    .filter(s => s.mode !== 'work')
    .reduce((acc, s) => acc + s.duration, 0)

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}s ${m}dk` : `${m}dk`
  }

  return (
    <div className="min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="font-[Manrope] font-extrabold text-[var(--color-primary)] tracking-tighter text-xl">Temporal Sanctuary</div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-8 items-center mr-8">
              <a href="/" className="font-[Manrope] font-bold hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 px-3 py-1 rounded-lg text-[var(--color-on-surface-variant)]">Zamanlayıcı</a>
              <a href="/statistics" className="font-[Manrope] font-bold hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 px-3 py-1 rounded-lg text-[var(--color-on-surface-variant)]">İstatistikler</a>
              <span className="font-bold font-[Manrope] px-3 py-1 rounded-lg text-[var(--color-primary)]">Ayarlar</span>
            </div>
            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 p-2 rounded-full">account_circle</span>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent h-px"></div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-12">
          {/* Header Section */}
          <section className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight font-[Manrope]">Ayarlar</h1>
            <p className="text-[var(--color-on-surface-variant)] font-body">Kişisel odaklanma ritminizi ve çevre seslerini optimize edin.</p>
          </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Pomodoro Timers (Major Column) */}
            <div className="md:col-span-8 flex flex-col gap-6 p-8 rounded-[32px] bg-[var(--color-surface-container-low)]">
              <div className="flex items-center gap-3 text-[var(--color-primary)]">
                <span className="material-symbols-outlined">timer</span>
                <h2 className="text-xl font-bold tracking-tight font-[Manrope]">Zamanlayıcı Ayarları</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {/* Work Duration */}
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-[var(--color-surface-container-high)] transition-all hover:bg-[var(--color-surface-container-highest)]">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Çalışma Süresi</label>
                    <span className="text-[var(--color-primary)] font-[Manrope] text-xl font-bold">{settings.workDuration} Dakika</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={settings.workDuration}
                    onChange={(e) => setSettings(s => ({ ...s, workDuration: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-[var(--color-surface-variant)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  />
                </div>

                {/* Short Break */}
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-[var(--color-surface-container-high)] transition-all hover:bg-[var(--color-surface-container-highest)]">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Kısa Mola</label>
                    <span className="text-[var(--color-secondary)] font-[Manrope] text-xl font-bold">{settings.shortBreakDuration} Dakika</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings(s => ({ ...s, shortBreakDuration: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-[var(--color-surface-variant)] rounded-full appearance-none cursor-pointer accent-[var(--color-secondary)]"
                  />
                </div>

                {/* Long Break */}
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-[var(--color-surface-container-high)] transition-all hover:bg-[var(--color-surface-container-highest)]">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Uzun Mola</label>
                    <span className="text-[var(--color-tertiary)] font-[Manrope] text-xl font-bold">{settings.longBreakDuration} Dakika</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={45}
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings(s => ({ ...s, longBreakDuration: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-[var(--color-surface-variant)] rounded-full appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                  />
                </div>
              </div>
            </div>

            {/* Theme & Mode (Side Column) */}
            <div className="md:col-span-4 flex flex-col gap-6 p-8 rounded-[32px] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/10">
              <div className="flex items-center gap-3 text-[var(--color-secondary)]">
                <span className="material-symbols-outlined">palette</span>
                <h2 className="text-xl font-bold tracking-tight font-[Manrope]">Görünüm</h2>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
                    settings.theme === 'dark'
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">dark_mode</span>
                    <span>Koyu Tema</span>
                  </div>
                  {settings.theme === 'dark' && (
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-medium transition-all hover:bg-[var(--color-surface-bright)] active:scale-95 ${
                    settings.theme === 'light'
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">light_mode</span>
                    <span>Açık Tema</span>
                  </div>
                </button>
              </div>

              {/* Auto Start Toggle */}
              <div className="mt-4 pt-6 border-t border-[var(--color-outline-variant)]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">Otomatik Başlat</span>
                  <button
                    onClick={() => setSettings(s => ({ ...s, autoStartBreaks: !s.autoStartBreaks }))}
                    className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-colors ${
                      settings.autoStartBreaks
                        ? 'bg-[var(--color-secondary-container)]'
                        : 'bg-[var(--color-surface-container-highest)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        settings.autoStartBreaks ? 'translate-x-6 bg-[var(--color-secondary)]' : 'translate-x-0 bg-[var(--color-on-surface-variant)]'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sound Settings (Full Width Bottom) */}
            <div className="md:col-span-12 flex flex-col md:flex-row gap-12 p-8 rounded-[32px] bg-[var(--color-surface-container-low)]">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-[var(--color-tertiary)]">
                  <span className="material-symbols-outlined">volume_up</span>
                  <h2 className="text-xl font-bold tracking-tight font-[Manrope]">Ses ve Bildirimler</h2>
                </div>
                <div className="flex flex-col gap-6">
                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">Bildirim Sesi</span>
                    <button
                      onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                      className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-colors ${
                        settings.soundEnabled
                          ? 'bg-[var(--color-tertiary-container)]'
                          : 'bg-[var(--color-surface-container-highest)]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform ${
                          settings.soundEnabled ? 'translate-x-6 bg-[var(--color-tertiary)]' : 'translate-x-0 bg-[var(--color-on-surface-variant)]'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Sound Volume */}
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">Ses Seviyesi</label>
                      <span className="text-[var(--color-on-surface)] font-[Manrope] font-bold">{settings.soundVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={settings.soundVolume}
                      onChange={(e) => setSettings(s => ({ ...s, soundVolume: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-[var(--color-surface-variant)] rounded-full appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                      disabled={!settings.soundEnabled}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--color-surface-container-high)] rounded-[24px] relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center text-center p-8 gap-3">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">graphic_eq</span>
                  <p className="text-sm text-[var(--color-on-surface-variant)] max-w-[200px]">
                    Toplam {sessions.length} oturum tamamlandı.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--color-primary)]">{formatDuration(totalWorkMinutes)}</div>
                      <div className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-widest">Çalışma</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--color-secondary)]">{formatDuration(totalBreakMinutes)}</div>
                      <div className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-widest">Mola</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end gap-4 pb-12">
            <button
              onClick={resetSettings}
              className="px-8 py-4 rounded-full text-[var(--color-on-surface)] font-bold hover:bg-[var(--color-surface-container-high)] transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={saveSettings}
              className="px-12 py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-extrabold tracking-tight shadow-[0_12px_24px_rgba(252,89,41,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </main>

      {/* Save Toast */}
      {showSaveToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-bold shadow-lg animate-pulse">
          Değişiklikler kaydedildi!
        </div>
      )}

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[var(--color-surface-container-low)]/60 backdrop-blur-xl rounded-t-[32px] overflow-hidden">
        <a href="/" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] opacity-40 px-6 py-2 hover:opacity-100 hover:bg-[var(--color-surface-container-high)]/40 transition-all">
          <span className="material-symbols-outlined">timer</span>
          <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">Zamanlayıcı</span>
        </a>
        <a href="/statistics" className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] opacity-40 px-6 py-2 hover:opacity-100 hover:bg-[var(--color-surface-container-high)]/40 transition-all">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">İstatistikler</span>
        </a>
        <div className="flex flex-col items-center justify-center bg-[var(--color-primary-container)]/15 text-[var(--color-primary)] rounded-[20px] px-6 py-2 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <span className="font-[Inter] text-[10px] font-medium uppercase tracking-widest mt-1">Ayarlar</span>
        </div>
      </nav>
    </div>
  )
}

export default Settings
