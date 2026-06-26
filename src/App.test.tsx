import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('App - Test básico de funcionalidad del sitio', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza la aplicación sin errores', () => {
    render(<App />);
    expect(screen.getByText('¡Nos Casamos!')).toBeInTheDocument();
  });

  it('muestra los nombres de los novios correctamente', () => {
    render(<App />);
    expect(screen.getByText('FERNANDA')).toBeInTheDocument();
    expect(screen.getByText('DIEGO')).toBeInTheDocument();
  });

  it('muestra la fecha de la boda', () => {
    render(<App />);
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('SÁBADO')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('ENERO')).toBeInTheDocument();
  });

it('muestra los detalles de la ceremonia', () => {
    render(<App />);
    expect(screen.getByText('11:30 hs.')).toBeInTheDocument();
    expect(screen.getByText('CEREMONIA')).toBeInTheDocument();
    expect(screen.getAllByText('Parroquia Padre Pío de Pietrelcina')).toHaveLength(2);
  });

  it('muestra los detalles de la celebración', () => {
    render(<App />);
    expect(screen.getByText('14:00 hs.')).toBeInTheDocument();
    expect(screen.getByText('CELEBRACIÓN EN NUESTRO JARDÍN')).toBeInTheDocument();
    expect(screen.getByText('Encuentro campestre al aire libre')).toBeInTheDocument();
  });

  it('muestra el formulario de RSVP', () => {
    render(<App />);
    expect(screen.getByText('¿Nos Acompañas?')).toBeInTheDocument();
    expect(screen.getByText('Confirma tu lugar para que organicemos el menú ideal')).toBeInTheDocument();
  });

  it('muestra la sección de Mapas', () => {
    render(<App />);
    expect(screen.getByText('¿Cómo Llegar?')).toBeInTheDocument();
    expect(screen.getByText('Haz clic para ver ubicaciones y trazar tu ruta')).toBeInTheDocument();
  });

  it('muestra el contador regresivo', () => {
    render(<App />);
    const countdown = screen.getByTestId('countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('muestra el pie de página correctamente', () => {
    render(<App />);
    expect(screen.getByText('© 2027 • Hecho con amor por Fernanda & Diego.')).toBeInTheDocument();
    expect(screen.getByText('Mar del Plata • Faro Norte')).toBeInTheDocument();
  });

  it('tiene la estructura principal correcta', () => {
    render(<App />);
    const mainContent = screen.getByRole('main') || document.querySelector('#main-content');
    expect(mainContent).toBeTruthy();
    
    const footer = screen.getByRole('contentinfo') || document.querySelector('#app-footer');
    expect(footer).toBeTruthy();
  });
});