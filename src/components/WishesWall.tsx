/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { RSVP } from '../types';

interface WishesWallProps {
  rsvps: RSVP[];
}

interface Wish {
  id: string;
  name: string;
  message: string;
  date: string;
}

const PRE_SEEDED_WISHES: Wish[] = [
  {
    id: 'seed-1',
    name: 'Santi y Sofía',
    message: '¡Muchas felicidades Fer y Diego! Qué alegría tan inmensa verlos dar este paso. No nos perderíamos por nada este hermoso festejo frente al mar. ¡Los queremos muchísimo! ❤️🕊️',
    date: '2026-06-23T18:45:00Z'
  },
  {
    id: 'seed-2',
    name: 'Matias Soler',
    message: '¡Amigos queridos! Preparándome para ese almuerzo increíble en el jardín. Qué gran idea celebrar de día, va a ser espectacular. Toda la felicidad del mundo para ustedes. 🥂✨',
    date: '2026-06-24T10:12:00Z'
  },
  {
    id: 'seed-3',
    name: 'Tía Clara y Tío Carlos',
    message: 'Que Dios bendiga su unión hoy y siempre. Es hermoso verlos crecer juntos desde el primer día. Estaremos allí listos con pañuelos para la emoción. ¡Felicidades, sobrinos adorados! 💍🌸',
    date: '2026-06-24T15:30:00Z'
  },
  {
    id: 'seed-4',
    name: 'Valu y Gaby',
    message: '¡Por fin se casan! Qué felicidad tan grande verlos celebrar su amor. ¡Les deseamos un camino lleno de risas, viajes y mucha complicidad! 🎉🕺💃',
    date: '2026-06-25T02:20:00Z'
  }
];

export default function WishesWall({ rsvps }: WishesWallProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    // Process local RSVPs to find those with messages
    const rsvpWishes: Wish[] = rsvps
      .filter(r => r.message && r.message.trim() !== '')
      .map(r => ({
        id: r.id,
        name: r.name,
        message: r.message!,
        date: r.confirmedAt
      }));

    // Combine pre-seeded wishes with real local RSVP wishes (placed first)
    setWishes([...rsvpWishes, ...PRE_SEEDED_WISHES]);
  }, [rsvps]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recientemente';
    }
  };

  return (
    <div className="w-full" id="wishes-wall-section">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-rose-50 text-rose-500 border border-rose-100 mb-2">
          <Heart className="w-5 h-5 fill-rose-500 text-transparent animate-pulse" />
        </div>
        <h3 className="font-serif text-2xl text-olive-950 font-light mb-1">
          Libro de Firmas Digital
        </h3>
        <p className="font-sans text-xs text-gray-500 tracking-wider">
          Hermosos deseos dejados por nuestros seres queridos
        </p>
      </div>

      {wishes.length === 0 ? (
        <div className="text-center py-10 bg-white/40 border border-dashed border-olive-200 rounded-xl" id="wishes-empty">
          <MessageSquare className="w-8 h-8 text-olive-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-sans">
            Aún no hay mensajes. ¡Sé el primero en dejar uno al confirmar tu asistencia!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6" id="wishes-grid">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              id={`wish-card-${wish.id}`}
              className="relative bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-olive-200/30 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              {/* Decorative quotation mark */}
              <span className="absolute top-2 right-4 text-olive-100 font-serif text-5xl select-none leading-none">
                “
              </span>
              
              <p className="font-sans text-xs text-gray-700 leading-relaxed italic mb-4 relative z-10">
                "{wish.message}"
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-olive-100/50">
                <span className="font-serif text-sm font-medium text-olive-900">
                  {wish.name}
                </span>
                <span className="font-sans text-[9px] text-gray-400">
                  {formatDate(wish.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
