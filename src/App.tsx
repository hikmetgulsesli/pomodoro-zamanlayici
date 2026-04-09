import { useState, useEffect, useCallback } from 'react';
import './App.css';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type TimerState = 'idle' | 'running' | 'paused';

const DEFAULT_TIMES = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function App() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work);
  const [totalTime, setTotalTime] = useState(DEFAULT_TIMES.work);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerState === 'running') {
      setTimerState('idle');
      if (mode === 'work') setCompletedPomodoros((prev) => prev + 1);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerState, timeLeft, mode]);

  const resetTimer = useCallback(() => {
    setTimerState('idle');
    setTimeLeft(DEFAULT_TIMES[mode]);
    setTotalTime(DEFAULT_TIMES[mode]);
  }, [mode]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimerState('idle');
    setTimeLeft(DEFAULT_TIMES[newMode]);
    setTotalTime(DEFAULT_TIMES[newMode]);
  }, []);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const getModeLabel = () => {
    if (mode === 'work') return 'Odaklanma Zamanı';
    if (mode === 'shortBreak') return 'Kısa Mola';
    return 'Uzun Mola';
  };

  const getButtonText = () => {
    if (timerState === 'running') return 'DURDUR';
    if (timerState === 'paused') return 'DEVAM ET';
    return 'BAŞLAT';
  };

  const handleMainButton = () => {
    if (timerState === 'running') setTimerState('paused');
    else setTimerState('running');
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="font-headline font-extrabold text-primary text-xl">Temporal Sanctuary</div>
          <div className="hidden md:flex gap-8">
            <a className="font-headline font-bold text-primary hover:bg-surface-container-high px-3 py-1 rounded-lg" href="#">Zamanlayıcı</a>
            <a className="font-headline font-bold text-on-surface-variant opacity-60 hover:bg-surface-container-high px-3 py-1 rounded-lg" href="#">İstatistikler</a>
            <a className="font-headline font-bold text-on-surface-variant opacity-60 hover:bg-surface-container-high px-3 py-1 rounded-lg" href="#">Ayarlar</a>
          </div>
          <button className="material-symbols-outlined text-primary hover:bg-surface-container-high p-2 rounded-full">account_circle</button>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 flex flex-col items-center space-y-12">
          <div className="flex bg-surface-container-low p-1.5 rounded-full">
            <button onClick={() => switchMode('work')} className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm ${mode === 'work' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}>Çalışma</button>
            <button onClick={() => switchMode('shortBreak')} className={`px-6 py-2.5 rounded-full font-headline font-medium text-sm ${mode === 'shortBreak' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}>Kısa Mola</button>
            <button onClick={() => switchMode('longBreak')} className={`px-6 py-2.5 rounded-full font-headline font-medium text-sm ${mode === 'longBreak' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}>Uzun Mola</button>
          </div>

          <div className="relative w-full aspect-square max-w-[480px] flex items-center justify-center">
            <div className="absolute inset-0 timer-pulse rounded-full animate-pulse"></div>
            <div className="absolute inset-4 rounded-full border-[12px] border-surface-container-low"></div>
            <div className="absolute inset-4 rounded-full border-[12px] border-transparent" style={{backgroundImage: `conic-gradient(#ffb5a0 ${progress}%, transparent ${progress}%)`, borderRadius: '9999px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}}></div>
            <div className="text-center z-10">
              <h2 className="text-on-surface-variant font-headline text-xs mb-2 uppercase tracking-widest">{getModeLabel()}</h2>
              <div className="font-headline font-extrabold text-[80px] md:text-[120px] text-on-surface">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={resetTimer} className="w-16 h-16 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-2xl">refresh</span></button>
            <button onClick={handleMainButton} className="px-12 py-5 rounded-full bg-primary text-on-primary font-headline font-extrabold text-xl shadow-lg hover:scale-105">{getButtonText()}</button>
            <button onClick={resetTimer} className="w-16 h-16 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-2xl">stop</span></button>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-[32px]">
            <div className="flex justify-between items-start">
              <div><h3 className="font-headline font-bold text-on-surface text-lg">Günlük İlerleme</h3><p className="text-on-surface-variant text-sm">Bugün tamamlanan pomodorolar</p></div>
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="font-headline font-extrabold text-5xl text-primary">{completedPomodoros}</span>
              <span className="text-on-surface-variant">/ 8 hedef</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{width: `${Math.min((completedPomodoros/8)*100,100)}%`}}></div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[32px]">
            <h3 className="font-headline font-bold text-on-surface text-lg mb-4">Mevcut Oturum</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-on-surface-variant">Mod</span><span className="text-on-surface">{mode==='work'?'Çalışma':mode==='shortBreak'?'Kısa Mola':'Uzun Mola'}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Durum</span><span className="text-on-surface">{timerState==='idle'?'Bekliyor':timerState==='running'?'Çalışıyor':'Duraklatıldı'}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Kalan Süre</span><span className="text-primary">{formatTime(timeLeft)}</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
