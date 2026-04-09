import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { type PomodoroSession, type TimerMode, MODE_LABELS } from './types'

type ViewPeriod = 'day' | 'week' | 'month'

interface DailyStats {
  date: string
  label: string
  workSessions: number
  workMinutes: number
  shortBreaks: number
  longBreaks: number
}

const MODE_COLORS: Record<TimerMode, string> = {
  work: '#ffb5a0',
  shortBreak: '#70d8c8',
  longBreak: '#edbbac'
}

// MODE_LABELS imported from types.ts

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDayLabel(date: Date): string {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
  return days[date.getDay() === 0 ? 6 : date.getDay() - 1]
}

function getMonthLabel(date: Date): string {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  return months[date.getMonth()]
}

export default function Statistics() {
  const [period, setPeriod] = useState<ViewPeriod>('week')
  const [sessions, setSessions] = useState<PomodoroSession[]>([])

  useEffect(() => {
    const loadSessions = () => {
      try {
        const saved = localStorage.getItem('pomodoro-sessions')
        if (saved) {
          return JSON.parse(saved) as PomodoroSession[]
        }
      } catch {
        // localStorage not available
      }
      return []
    }
    
    // Use a microtask to avoid synchronous setState during render
    Promise.resolve().then(() => {
      setSessions(loadSessions())
    })
  }, [])

  // Calculate statistics based on period
  const stats = (() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    let startDate: Date
    let data: DailyStats[] = []

    if (period === 'day') {
      // Last 24 hours - show hourly data
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 1)
      
      const hourlyData: Record<number, { work: number; shortBreak: number; longBreak: number }> = {}
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { work: 0, shortBreak: 0, longBreak: 0 }
      }
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.completedAt)
        if (sessionDate >= startDate && sessionDate <= now) {
          const hour = sessionDate.getHours()
          if (session.mode === 'work') hourlyData[hour].work++
          else if (session.mode === 'shortBreak') hourlyData[hour].shortBreak++
          else hourlyData[hour].longBreak++
        }
      })
      
      data = Object.entries(hourlyData).map(([hour, counts]) => ({
        date: `${hour}:00`,
        label: `${hour}:00`,
        workSessions: counts.work,
        workMinutes: counts.work * 25,
        shortBreaks: counts.shortBreak,
        longBreaks: counts.longBreak
      }))
    } else if (period === 'week') {
      // Last 7 days
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 6)
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        data.push({
          date: formatDate(d),
          label: getDayLabel(d),
          workSessions: 0,
          workMinutes: 0,
          shortBreaks: 0,
          longBreaks: 0
        })
      }
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.completedAt)
        const sessionDay = formatDate(sessionDate)
        const dayData = data.find(d => d.date === sessionDay)
        if (dayData) {
          if (session.mode === 'work') {
            dayData.workSessions++
            dayData.workMinutes += Math.floor(session.duration / 60)
          } else if (session.mode === 'shortBreak') {
            dayData.shortBreaks++
          } else {
            dayData.longBreaks++
          }
        }
      })
    } else {
      // Last 30 days grouped by week
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 29)
      
      // Group by week
      const weeklyData: Record<string, DailyStats> = {}
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.completedAt)
        if (sessionDate >= startDate && sessionDate <= now) {
          const weekStart = new Date(sessionDate)
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          const weekKey = formatDate(weekStart)
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
              date: weekKey,
              label: `${getMonthLabel(weekStart)} ${weekStart.getDate()}`,
              workSessions: 0,
              workMinutes: 0,
              shortBreaks: 0,
              longBreaks: 0
            }
          }
          
          if (session.mode === 'work') {
            weeklyData[weekKey].workSessions++
            weeklyData[weekKey].workMinutes += Math.floor(session.duration / 60)
          } else if (session.mode === 'shortBreak') {
            weeklyData[weekKey].shortBreaks++
          } else {
            weeklyData[weekKey].longBreaks++
          }
        }
      })
      
      data = Object.values(weeklyData).sort((a, b) => a.date.localeCompare(b.date))
    }
    
    return data
  })()

  // Calculate totals
  const totals = (() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let startDate: Date
    
    if (period === 'day') {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 1)
    } else if (period === 'week') {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 6)
    } else {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 29)
    }
    
    const filteredSessions = sessions.filter(s => {
      const sessionDate = new Date(s.completedAt)
      return sessionDate >= startDate && sessionDate <= now
    })
    
    const workSessions = filteredSessions.filter(s => s.mode === 'work')
    const workMinutes = workSessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0)
    const shortBreaks = filteredSessions.filter(s => s.mode === 'shortBreak').length
    const longBreaks = filteredSessions.filter(s => s.mode === 'longBreak').length
    
    return { workSessions: workSessions.length, workMinutes, shortBreaks, longBreaks }
  })()

  // Mode distribution for pie chart
  const modeDistribution = (() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let startDate: Date
    
    if (period === 'day') {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 1)
    } else if (period === 'week') {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 6)
    } else {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 29)
    }
    
    const filteredSessions = sessions.filter(s => {
      const sessionDate = new Date(s.completedAt)
      return sessionDate >= startDate && sessionDate <= now
    })
    
    return [
      { name: MODE_LABELS.work, value: filteredSessions.filter(s => s.mode === 'work').length, color: MODE_COLORS.work },
      { name: MODE_LABELS.shortBreak, value: filteredSessions.filter(s => s.mode === 'shortBreak').length, color: MODE_COLORS.shortBreak },
      { name: MODE_LABELS.longBreak, value: filteredSessions.filter(s => s.mode === 'longBreak').length, color: MODE_COLORS.longBreak }
    ].filter(item => item.value > 0)
  })()

  // Calculate focus score (0-100)
  const focusScore = (() => {
    if (totals.workSessions === 0) return 0
    const idealWorkBreakRatio = 5 // 5 work sessions per break
    const actualRatio = totals.workSessions / (totals.shortBreaks + totals.longBreaks || 1)
    const ratioScore = Math.min(100, (actualRatio / idealWorkBreakRatio) * 100)
    const volumeScore = Math.min(100, (totals.workSessions / (period === 'day' ? 8 : period === 'week' ? 40 : 160)) * 100)
    return Math.round((ratioScore * 0.4) + (volumeScore * 0.6))
  })()

  return (
    <main className="pt-24 px-6 pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-secondary font-label text-xs tracking-widest uppercase mb-2 block">Performans Analizi</span>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">İstatistikler</h2>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          {(['day', 'week', 'month'] as ViewPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-label uppercase tracking-widest transition-colors ${
                period === p 
                  ? 'bg-surface-container-high text-primary rounded-lg' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p === 'day' ? 'Günlük' : p === 'week' ? 'Haftalık' : 'Aylık'}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="md:col-span-4 space-y-6">
          {/* Working Time */}
          <div className="bg-surface-container-low p-8 rounded-[32px] flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">schedule</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-sm font-medium">Toplam Çalışma</span>
              <div className="text-3xl font-headline font-bold text-primary mt-1">
                {Math.floor(totals.workMinutes / 60)}s {totals.workMinutes % 60}dk
              </div>
            </div>
            <div className="text-xs text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              {totals.workSessions} pomodoro tamamlandı
            </div>
          </div>
          
          {/* Break Time */}
          <div className="bg-surface-container-low p-8 rounded-[32px] flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">coffee</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-sm font-medium">Toplam Mola</span>
              <div className="text-3xl font-headline font-bold text-secondary mt-1">
                {totals.shortBreaks + totals.longBreaks} mola
              </div>
            </div>
            <div className="text-xs text-on-surface-variant/60">
              {totals.shortBreaks} kısa, {totals.longBreaks} uzun
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="md:col-span-8 bg-surface-container-high p-8 rounded-[32px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface">Pomodoro Verimliliği</h3>
              <p className="text-on-surface-variant text-sm mt-1">
                {period === 'day' ? 'Saatlik' : period === 'week' ? 'Haftalık' : 'Aylık'} tamamlanan seanslar
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-headline font-bold text-primary">{totals.workSessions}</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">Seans</div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-container-highest)" />
                <XAxis 
                  dataKey="label" 
                  stroke="var(--color-on-surface-variant)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--color-on-surface-variant)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface-container-high)', 
                    border: 'none',
                    borderRadius: '12px',
                    color: 'var(--color-on-surface)'
                  }}
                />
                <Bar dataKey="workSessions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mode Distribution */}
        <div className="md:col-span-6 bg-surface-container-low p-8 rounded-[32px]">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Mod Dağılımı</h3>
          <div className="h-48">
            {modeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-surface-container-high)', 
                      border: 'none',
                      borderRadius: '12px',
                      color: 'var(--color-on-surface)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant">
                Henüz veri yok
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {modeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-on-surface-variant">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Score */}
        <div className="md:col-span-6 bg-gradient-to-br from-primary-container/20 to-transparent p-8 rounded-[32px] border border-outline-variant/10">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-4">Focus Skoru</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90">
                <circle 
                  className="text-surface-container-highest" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="44" 
                  stroke="currentColor" 
                  strokeWidth="8"
                />
                <circle 
                  className="text-primary" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="44" 
                  stroke="currentColor" 
                  strokeDasharray="276" 
                  strokeDashoffset={276 - (276 * focusScore / 100)} 
                  strokeWidth="8"
                />
              </svg>
              <span className="text-2xl font-headline font-extrabold text-on-surface">{focusScore}</span>
            </div>
            <div>
              <div className="text-secondary font-bold text-lg">
                {focusScore >= 80 ? 'Mükemmel!' : focusScore >= 60 ? 'İyi!' : focusScore >= 40 ? 'Orta' : 'Başlangıç'}
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Odaklanma süren ve çalışma/mola dengen analiz edildi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="bg-surface-container-low rounded-[32px] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">hourglass_empty</span>
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Henüz Veri Yok</h3>
          <p className="text-on-surface-variant mb-6">İlk pomodoronu tamamladığında istatistiklerin burada görünecek.</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary font-headline font-bold shadow-[0_8px_32px_rgba(252,89,41,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            Zamanlayıcıyı Başlat
          </Link>
        </div>
      )}
    </main>
  )
}