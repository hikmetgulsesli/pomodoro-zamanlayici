import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Pomodoro Zamanlayıcı', () => {
  it('uygulama başlığını gösterir', () => {
    render(<App />);
    expect(screen.getByText('Temporal Sanctuary')).toBeInTheDocument();
  });

  it('başlangıçta çalışma modunda 25:00 gösterir', () => {
    render(<App />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Odaklanma Zamanı')).toBeInTheDocument();
  });

  it('mod değiştirme butonları çalışır', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Kısa Mola'));
    expect(screen.getByText('05:00')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Uzun Mola'));
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('günlük ilerleme gösterilir', () => {
    render(<App />);
    expect(screen.getByText('Günlük İlerleme')).toBeInTheDocument();
  });
});
