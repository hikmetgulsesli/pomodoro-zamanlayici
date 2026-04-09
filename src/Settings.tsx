import { useSettings } from './SettingsContext';
import { formatTime, SOUND_LABELS } from './types';

export default function Settings() {
  const { settings, updateTimerSettings, updateSoundSettings, setTheme, resetSettings } = useSettings();

  return (
    <div className="min-h-screen bg-surface pb-32">
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Ayarlar</h1>
            <p className="text-on-surface-variant">Kişisel odaklanma ritminizi ve çevre seslerini optimize edin.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 flex flex-col gap-6 p-8 rounded-[32px] bg-surface-container-low">
              <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">timer</span>
                <h2 className="text-xl font-bold tracking-tight font-headline">Zamanlayıcı Ayarları</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Çalışma Süresi</label>
                    <span className="text-primary font-headline text-xl font-bold">{formatTime(settings.timer.workDuration)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={settings.timer.workDuration}
                    onChange={(e) => updateTimerSettings({ workDuration: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Kısa Mola</label>
                    <span className="text-secondary font-headline text-xl font-bold">{formatTime(settings.timer.shortBreakDuration)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={settings.timer.shortBreakDuration}
                    onChange={(e) => updateTimerSettings({ shortBreakDuration: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-secondary"
                  />
                </div>
                <div className="group flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-high transition-all hover:bg-surface-container-highest">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Uzun Mola</label>
                    <span className="text-tertiary font-headline text-xl font-bold">{formatTime(settings.timer.longBreakDuration)}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={settings.timer.longBreakDuration}
                    onChange={(e) => updateTimerSettings({ longBreakDuration: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-tertiary"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6 p-8 rounded-[32px] bg-surface-container-high border border-outline-variant/10">
              <div className="flex items-center gap-3 text-secondary">
                <span className="material-symbols-outlined">palette</span>
                <h2 className="text-xl font-bold tracking-tight font-headline">Görünüm</h2>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
                    settings.theme === 'dark'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">dark_mode</span>
                    <span>Koyu Tema</span>
                  </div>
                  {settings.theme === 'dark' && <span className="material-symbols-outlined">check_circle</span>}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-medium transition-all hover:bg-surface-bright active:scale-95 ${
                    settings.theme === 'light'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">light_mode</span>
                    <span>Açık Tema</span>
                  </div>
                  {settings.theme === 'light' && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              </div>
            </div>

            <div className="md:col-span-12 flex flex-col md:flex-row gap-12 p-8 rounded-[32px] bg-surface-container-low">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-tertiary">
                  <span className="material-symbols-outlined">volume_up</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Ses ve Bildirimler</h2>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Bildirim Sesi</label>
                    <div className="relative">
                      <select
                        value={settings.sound.soundType}
                        onChange={(e) => updateSoundSettings({ soundType: e.target.value as typeof settings.sound.soundType })}
                        className="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-surface appearance-none focus:ring-1 focus:ring-primary/40"
                      >
                        <option value="zen">{SOUND_LABELS.zen}</option>
                        <option value="digital">{SOUND_LABELS.digital}</option>
                        <option value="piano">{SOUND_LABELS.piano}</option>
                        <option value="nature">{SOUND_LABELS.nature}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Ses Seviyesi</label>
                      <span className="text-on-surface font-headline font-bold">{settings.sound.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.sound.volume}
                      onChange={(e) => updateSoundSettings({ volume: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-surface-variant rounded-full appearance-none cursor-pointer accent-tertiary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-12">
            <button
              onClick={resetSettings}
              className="px-8 py-4 rounded-full text-on-surface font-bold hover:bg-surface-container-high transition-colors"
            >
              Vazgeç
            </button>
            <button className="px-12 py-4 rounded-full bg-primary text-on-primary font-extrabold tracking-tight shadow-[0_12px_24px_rgba(252,89,41,0.2)] hover:scale-105 active:scale-95 transition-all">
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
