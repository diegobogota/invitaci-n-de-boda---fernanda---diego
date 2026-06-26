/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import BackgroundMusic from './components/BackgroundMusic';
import Countdown from './components/Countdown';
import LocationMap from './components/LocationMap';
import RSVPForm from './components/RSVPForm';
import AdminPanel from './components/AdminPanel';
import { RSVP } from './types';

// Importing generated watercolor images
const oliveBranches = '/src/assets/images/watercolor_olive_branches_1782404574582.jpg';
const chapelWatercolor = '/public/wedding Parrish Padre Pio Watercolor paiting.jpeg';

export default function App() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  // Load RSVPs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wedding_rsvps');
    if (stored) {
      setRsvps(JSON.parse(stored));
    }
  }, []);

  const handleRSVPSubmitted = (newRsvp: RSVP) => {
    setRsvps(prev => {
      // If name already exists, overwrite it, otherwise append
      const filtered = prev.filter(r => r.name.toLowerCase() !== newRsvp.name.toLowerCase());
      const updated = [newRsvp, ...filtered];
      return updated;
    });
  };

  const handleDeleteRSVP = (id: string) => {
    const updated = rsvps.filter(r => r.id !== id);
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  const handleClearAllRSVPs = () => {
    setRsvps([]);
    localStorage.removeItem('wedding_rsvps');
    localStorage.removeItem('wedding_rsvp_submitted');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-6 px-4 md:py-12 md:px-6 relative selection:bg-olive-200" id="invitation-app-root">
      {/* Background organic leaf textures */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#EFF1E6] via-transparent to-transparent pointer-events-none opacity-40 z-0"></div>

      {/* Floating Music Controls */}
      <BackgroundMusic />

      <main className="max-w-4xl mx-auto space-y-8 relative z-10" id="main-content">
        {/* HERO CARD - Exact digital card replica with beautiful enhancements */}
        <div 
          id="digital-card-envelope"
          className="bg-[#FAF8F5] rounded-3xl border border-[#EBE7DF] shadow-xl overflow-hidden relative max-w-xl mx-auto animate-fade-in"
        >
          {/* Top Watercolor Olive Branches */}
          <div className="relative w-full aspect-[16/9] overflow-hidden" id="card-hero-banner">
            <img 
              src={oliveBranches} 
              alt="Ramas de Olivo Acuarela" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-105 transform translate-y-[-5%] hover:scale-100 transition-transform duration-[4000ms]"
            />
            {/* Subtle overlay border shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent"></div>
          </div>

          {/* Invitation Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 text-center space-y-6" id="card-invitation-body">
            
            <div className="space-y-2" id="inv-header">
              <span className="font-sans text-[11px] font-bold tracking-[0.3em] text-olive-600 uppercase block">
                ¡Nos Casamos!
              </span>
              <div className="h-[1px] w-12 bg-gold-400 mx-auto"></div>
            </div>

            {/* Names */}
            <div className="py-4 space-y-1" id="inv-couple-names">
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-olive-900 tracking-wider">
                FERNANDA
              </h1>
              <div className="flex items-center justify-center gap-4">
                <span className="h-[1px] w-16 bg-gray-200"></span>
                <span className="font-script text-4xl text-gold-600 leading-none">&</span>
                <span className="h-[1px] w-16 bg-gray-200"></span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-olive-900 tracking-wider">
                DIEGO
              </h1>
            </div>

            {/* Year & Date Table */}
            <div className="space-y-4 py-2" id="inv-date-calendar">
              <span className="font-serif text-2xl font-light tracking-[0.2em] text-gray-700 block">
                2027
              </span>

              {/* Classic Date Grid exactly like the image card */}
              <div className="max-w-xs mx-auto border-y border-olive-900/15 py-3 flex items-center justify-around font-serif text-sm tracking-widest text-olive-950 uppercase font-medium">
                <span>SÁBADO</span>
                <div className="h-6 w-[1.5px] bg-olive-900/20"></div>
                <span className="text-2xl font-bold text-gold-600">23</span>
                <div className="h-6 w-[1.5px] bg-olive-900/20"></div>
                <span>ENERO</span>
              </div>
            </div>

            {/* Times and Places details matching image exact text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-center text-xs text-gray-700 font-sans" id="inv-event-details">
              
              {/* Ceremony Panel */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-olive-100/30 border border-olive-200/20 flex flex-col justify-between" id="card-ceremony-details">
                <div>
                  <p className="font-serif text-base font-bold text-olive-900 tracking-wide">
                    11:30 hs.
                  </p>
                  <p className="font-sans text-[10px] tracking-widest font-bold uppercase text-gold-600 mb-2">
                    CEREMONIA
                  </p>
                  <p className="font-sans text-[11px] leading-relaxed text-gray-600">
                    Parroquia Padre Pío de Pietrelcina
                  </p>
                  <p className="text-[10px] text-gray-400 italic">
                    Sánchez de Bustamante 3850 - Faro Norte
                  </p>
                </div>
              </div>

              {/* Celebration Panel */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-olive-100/30 border border-olive-200/20 flex flex-col justify-between" id="card-party-details">
                <div>
                  <p className="font-serif text-base font-bold text-olive-900 tracking-wide">
                    14:00 hs.
                  </p>
                  <p className="font-sans text-[10px] tracking-widest font-bold uppercase text-gold-600 mb-2">
                    CELEBRACIÓN EN NUESTRO JARDÍN
                  </p>
                  <p className="font-sans text-[11px] leading-relaxed text-gray-600">
                    Encuentro campestre al aire libre
                  </p>
                  <p className="text-[10px] text-gray-400 italic">
                    Abihail P. Borthaburu 4063 - Faro Norte
                  </p>
                </div>
              </div>

            </div>

            {/* Digital Card Footer Illustration (The watercolor chapel from card) */}
            <div className="pt-6 border-t border-gray-100" id="card-illustration-footer">
              <div className="max-w-[200px] mx-auto aspect-[16/9] rounded-2xl shadow-inner">
                <img 
                  src={chapelWatercolor} 
                  alt="Ilustración Acuarela de Capilla" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-sans text-[10px] text-gray-400 tracking-wider uppercase mt-4 font-semibold">
                Confirmar Asistencia:
              </p>
              <p className="font-serif text-sm font-semibold tracking-widest text-olive-800 mt-1">
                223 576-3957 / 223 656-5296
              </p>
            </div>

            <div className="flex justify-center pt-2 animate-bounce">
              <ArrowDown className="w-5 h-5 text-gold-600 opacity-60" />
            </div>

          </div>
        </div>

        {/* INTERACTIVE COUNTDOWN SECTION */}
        <div className="max-w-xl mx-auto" id="interactive-countdown-wrapper">
          <Countdown />
        </div>

        {/* INTERACTIVE MAPS & DIRECTIONS SECTION */}
        <div id="interactive-maps-section" className="space-y-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-olive-950 font-light tracking-wide">
              ¿Cómo Llegar?
            </h2>
            <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mt-1">
              Haz clic para ver ubicaciones y trazar tu ruta
            </p>
          </div>
          <LocationMap />
        </div>

        {/* INTERACTIVE RSVP FORM */}
        <div id="interactive-rsvp-section" className="max-w-xl mx-auto space-y-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-olive-950 font-light tracking-wide">
              ¿Nos Acompañas?
            </h2>
            <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mt-1">
              Confirma tu lugar para que organicemos el menú ideal
            </p>
          </div>
          <RSVPForm onRSVPSubmitted={handleRSVPSubmitted} />
        </div>

        {/* ADMIN PASSCODE PROTECTED NOVIO PANELS */}
        <AdminPanel
          rsvps={rsvps}
          onDeleteRSVP={handleDeleteRSVP}
          onClearAllRSVPs={handleClearAllRSVPs}
        />
      </main>

      {/* Decorative fine-printed footer */}
      <footer className="text-center pt-12 pb-6 text-[10px] font-sans tracking-widest text-gray-400 uppercase space-y-1" id="app-footer">
        <p>© 2027 • Hecho con amor por Fernanda & Diego.</p>
        <p className="text-[9px] opacity-60">Mar del Plata • Faro Norte</p>
      </footer>
    </div>
  );
}
