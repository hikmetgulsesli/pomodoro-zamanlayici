import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('Pomodoro Zamanlayıcı - US-003', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('Timer Display', () => {
    it('uygulama başlığını gösterir', () => {
      render(<App />)
      expect(screen.getByText('Temporal Sanctuary')).toBeDefined()
    })

    it('varsayılan olarak çalışma modunda başlar', () => {
      render(<App />)
      const calismaElements = screen.getAllByText('Çalışma')
      expect(calismaElements.length).toBeGreaterThanOrEqual(1)
    })

    it('zamanlayıcıyı MM:SS formatında gösterir', () => {
      render(<App />)
      const timeDisplay = screen.getByText(/\d{2}:\d{2}/)
      expect(timeDisplay).toBeDefined()
    })

    it('başlangıçta 25:00 gösterir', () => {
      render(<App />)
      expect(screen.getByText('25:00')).toBeDefined()
    })
  })

  describe('Timer Controls', () => {
    it('başlat/durdur butonu vardır', () => {
      render(<App />)
      const playButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'play_arrow'
      )
      expect(playButton).toBeDefined()
    })

    it('sıfırla butonu vardır', () => {
      render(<App />)
      const resetButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'replay'
      )
      expect(resetButton).toBeDefined()
    })

    it('başlat butonuna tıklayınca zamanlayıcı çalışır', () => {
      render(<App />)
      const playButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'play_arrow'
      )
      if (playButton) {
        fireEvent.click(playButton)
      }
      // After clicking play, the button should change to pause
      const pauseButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'pause'
      )
      expect(pauseButton).toBeDefined()
    })

    it('sıfırla butonuna tıklayınca zamanlayıcı sıfırlanır', () => {
      render(<App />)
      
      // Start timer
      const playButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'play_arrow'
      )
      if (playButton) {
        fireEvent.click(playButton)
      }
      
      // Advance time
      vi.advanceTimersByTime(5000)
      
      // Reset
      const resetButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('.material-symbols-outlined')?.textContent === 'replay'
      )
      if (resetButton) {
        fireEvent.click(resetButton)
      }
      
      expect(screen.getByText('25:00')).toBeDefined()
    })
  })

  describe('Mode Switching', () => {
    it('çalışma mod butonu vardır', () => {
      render(<App />)
      const calismaElements = screen.getAllByText('Çalışma')
      expect(calismaElements.length).toBeGreaterThanOrEqual(1)
    })

    it('kısa mola mod butonu vardır', () => {
      render(<App />)
      expect(screen.getByText('Kısa Mola')).toBeDefined()
    })

    it('uzun mola mod butonu vardır', () => {
      render(<App />)
      expect(screen.getByText('Uzun Mola')).toBeDefined()
    })

    it('kısa molaya geçince 05:00 gösterir', () => {
      render(<App />)
      const shortBreakBtn = screen.getByText('Kısa Mola')
      fireEvent.click(shortBreakBtn)
      expect(screen.getByText('05:00')).toBeDefined()
    })

    it('uzun molaya geçince 15:00 gösterir', () => {
      render(<App />)
      const longBreakBtn = screen.getByText('Uzun Mola')
      fireEvent.click(longBreakBtn)
      expect(screen.getByText('15:00')).toBeDefined()
    })
  })

  describe('Navigation', () => {
    it('zamanlayıcı navigasyonu vardır', () => {
      render(<App />)
      const timerNav = screen.getAllByText('Zamanlayıcı')
      expect(timerNav.length).toBeGreaterThan(0)
    })

    it('istatistikler navigasyonu vardır', () => {
      render(<App />)
      const statsNav = screen.getAllByText('İstatistikler')
      expect(statsNav.length).toBeGreaterThan(0)
    })

    it('ayarlar navigasyonu vardır', () => {
      render(<App />)
      const settingsNav = screen.getAllByText('Ayarlar')
      expect(settingsNav.length).toBeGreaterThan(0)
    })
  })

  describe('localStorage', () => {
    it('oturumları localStorage kaydeder', () => {
      render(<App />)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pomodoro-sessions')
    })
  })
})
