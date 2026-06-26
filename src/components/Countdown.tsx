/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const weddingDate = new Date('2027-01-23T11:30:00-03:00').getTime(); // Mar del Plata (GMT-3)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLapsed, setIsLapsed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setIsLapsed(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  if (isLapsed) {
    return (
      <div className="text-center py-6" id="countdown-completed">
        <p className="font-serif text-2xl text-olive-700 font-medium italic animate-pulse">
          ¡Llegó el gran día! 💍🕊️
        </p>
      </div>
    );
  }

  if (!timeLeft) return null;

  const items = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ];

return (
    <div className="flex flex-col items-center justify-center py-8" id="wedding-countdown-section" data-testid="countdown">
      <h3 className="font-sans text-xs tracking-[0.25em] text-gray-500 uppercase mb-5 font-semibold">
        Falta muy poco para el gran día
      </h3>
      
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-center">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center" id={`countdown-item-${item.label.toLowerCase()}`}>
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-olive-100 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/70 backdrop-blur-sm border border-olive-200/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 w-16 sm:w-20 md:w-24 text-center shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-olive-800">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <span className="font-sans text-[9px] sm:text-[10px] tracking-widest text-gray-500 font-medium mt-2">
                {item.label}
              </span>
            </div>
            
            {idx < items.length - 1 && (
              <span className="font-serif text-xl sm:text-2xl font-light text-olive-300 ml-4 sm:ml-6 md:ml-8">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
