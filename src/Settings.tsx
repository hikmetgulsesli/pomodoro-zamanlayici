import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type TimerSettings, DEFAULT_SETTINGS } from './types'

interface SettingsProps {
  settings: TimerSettings
  onSettingsChange: (settings: TimerSettings) => void
}

const SOUND_OPTIONS = [
  { value: 'zen', label: 'Zen Bowl (Varsayılan)' },
  { value: 'digital', label: 'Dijital Bip' },
  { value: 'piano', label: 'Yumuşak Piyano' },
  { value: 'nature', label: 'Doğa Sesleri' }
]

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  const navigate = useNavigate()
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleChange = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    setHasChanges(false)
    // Show saved feedback (could add toast here)
  }

  const handleCancel = () => {
    setLocalSettings(settings)
    setHasChanges(false)
    navigate('/')
  }

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS)
    setHasChanges(true)
  }

  return (
    <main className="pt-24 px-6 pb-32 max-w-4xl mx-auto">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Ayarlar</h1>
          <p className="text-on-surface-variant font-body">Kişisel odaklanma ritminizi ve çevre seslerini optimize edin.</p>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pomodoro Timers (Major Column) */}
          <div className="md:col-span-8 flex flex-col gap-6 p-8 rounded-[32px] bg-surface-container-low">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined">timer</span>
              <h2 className="text-xl font-bold tracking-tight font-headline">Zamanlayıcı Ayarları</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {/* Study Time */}
              <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Çalışma Süresi</label>
                  <span className="text-primary font-headline text-xl font-bold">{localSettings.workDuration} Dakika</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  value={localSettings.workDuration}
                  onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              {/* Short Break */}
              <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Kısa Mola</label>
                  <span className="text-secondary font-headline text-xl font-bold">{localSettings.shortBreakDuration} Dakika</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-secondary"
                />
              </div>
              
              {/* Long Break */}
              <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Uzun Mola</label>
                  <span className="text-tertiary font-headline text-xl font-bold">{localSettings.longBreakDuration} Dakika</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="45" 
                  value={localSettings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-tertiary"
                />
              </div>
            </div>
          </div>

          {/* Theme & Mode (Side Column) */}
          <div className="md:col-span-4 flex flex-col gap-6 p-8 rounded-[32px] bg-surface-container-high border border-outline-variant/10">
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined">palette</span>
              <h2 className="text-xl font-bold tracking-tight font-headline">Görünüm</h2>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleChange('theme', 'dark')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all transform active:scale-95 ${
                  localSettings.theme === 'dark'
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-highest text-on-surface-variant font-medium hover:bg-surface-bright'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: localSettings.theme === 'dark' ? "'FILL' 1" : "'FILL' 0" }}>dark_mode</span>
                  <span>Koyu Tema</span>
                </div>
                {localSettings.theme === 'dark' && (
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </button>
              <button 
                onClick={() => handleChange('theme', 'light')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all transform active:scale-95 ${
                  localSettings.theme === 'light'
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-highest text-on-surface-variant font-medium hover:bg-surface-bright'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">light_mode</span>
                  <span>Açık Tema</span>
                </div>
                {localSettings.theme === 'light' && (
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </button>
            </div>
          </div>

          {/* Sound Settings (Full Width Bottom) */}
          <div className="md:col-span-12 flex flex-col md:flex-row gap-12 p-8 rounded-[32px] bg-surface-container-low">
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-tertiary">
                <span className="material-symbols-outlined">volume_up</span>
                <h2 className="text-xl font-bold tracking-tight font-headline">Ses ve Bildirimler</h2>
              </div>
              <div className="flex flex-col gap-6">
                {/* Sound Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Bildirim Sesi</label>
                  <div className="relative">
                    <select 
                      value={localSettings.soundType}
                      onChange={(e) => handleChange('soundType', e.target.value as TimerSettings['soundType'])}
                      className="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-surface appearance-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                    >
                      {SOUND_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
                    </div>
                  </div>
                </div>
                
                {/* Volume */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Ses Seviyesi</label>
                    <span className="text-on-surface font-headline font-bold">{localSettings.soundVolume}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={localSettings.soundVolume}
                    onChange={(e) => handleChange('soundVolume', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-tertiary"
                  />
                </div>

                {/* Sound Enabled Toggle */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <span className="text-sm font-medium text-on-surface-variant">Sesli Bildirim</span>
                  <button
                    onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                    className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-colors ${
                      localSettings.soundEnabled ? 'bg-secondary-container' : 'bg-surface-container-highest'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full transition-transform ${
                      localSettings.soundEnabled ? 'bg-secondary translate-x-6' : 'bg-on-surface-variant'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="hidden md:flex flex-1 items-center justify-center bg-surface-container-high rounded-[24px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
              <div className="relative z-10 flex flex-col items-center text-center p-8 gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">graphic_eq</span>
                <p className="text-sm text-on-surface-variant max-w-[200px]">
                  Mükemmel odaklanma için çevresel gürültüyü maskeleyin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pb-12">
          <button 
            onClick={handleReset}
            className="px-8 py-4 rounded-full text-on-surface font-bold hover:bg-surface-container-high transition-colors"
          >
            Varsayılanlara Sıfırla
          </button>
          <button 
            onClick={handleCancel}
            className="px-8 py-4 rounded-full text-on-surface font-bold hover:bg-surface-container-high transition-colors"
          >
            Vazgeç
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-12 py-4 rounded-full font-extrabold tracking-tight shadow-[0_12px_24px_rgba(252,89,41,0.2)] transition-all ${
              hasChanges 
                ? 'bg-primary text-on-primary hover:scale-105 active:scale-95' 
                : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </main>
  )
}