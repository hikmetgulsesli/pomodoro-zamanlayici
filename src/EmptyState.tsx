import { Link } from 'react-router-dom';

export default function EmptyState() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/5 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
          <div className="relative mb-12 group">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="w-32 h-32 rounded-full bg-surface-container-high flex items-center justify-center shadow-[0_24px_48px_rgba(0,0,0,0.4)] border border-outline-variant/10">
              <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 200" }}>hourglass_empty</span>
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shadow-lg rotate-12">
              <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            </div>
          </div>
          
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">
            Sessizliğin Gücü
          </h1>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-10">
            Henüz bir veri yok. Zihnini dinlendirdin, şimdi odaklanma zamanı. <br/>
            <span className="text-primary/80">İlk Pomodoronu tamamla!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/"
              className="flex-1 bg-primary text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-[0_8px_32px_rgba(252,89,41,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Zamanlayıcıyı Başlat
            </Link>
            <button className="flex-1 bg-surface-container-high text-on-surface font-headline font-bold py-4 px-8 rounded-full border border-outline-variant/10 hover:bg-surface-container-highest transition-all duration-300 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_task</span>
              Görev Ekle
            </button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-2 gap-8 opacity-40">
          <div className="flex flex-col items-start border-l border-outline-variant/20 pl-4">
            <span className="text-[10px] font-label uppercase tracking-widest mb-1">Durum</span>
            <span className="text-xs font-body">Hazır Bekliyor</span>
          </div>
          <div className="flex flex-col items-start border-l border-outline-variant/20 pl-4">
            <span className="text-[10px] font-label uppercase tracking-widest mb-1">Odak</span>
            <span className="text-xs font-body">0 Dakika</span>
          </div>
        </div>
      </main>
    </div>
  );
}
