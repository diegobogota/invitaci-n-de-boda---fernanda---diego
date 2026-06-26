/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Church, Sparkles, MapPin, Compass, Copy, Check, ExternalLink } from 'lucide-react';

interface LocationInfo {
  id: 'ceremonia' | 'celebracion';
  title: string;
  subtitle: string;
  time: string;
  placeName: string;
  address: string;
  details: string;
  icon: typeof Church;
  embedUrl: string;
  directionsUrl: string;
}

export default function LocationMap() {
  const [activeTab, setActiveTab] = useState<'ceremonia' | 'celebracion'>('ceremonia');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const locations: LocationInfo[] = [
    {
      id: 'ceremonia',
      title: 'Ceremonia Religiosa',
      subtitle: 'Parroquia Padre Pío de Pietrelcina',
      time: '11:30 hs',
      placeName: 'Parroquia Padre Pío de Pietrelcina',
      address: 'Sánchez de Bustamante 3850, Faro Norte, Mar del Plata, Argentina',
      details: 'Acompáñanos a bendecir nuestro matrimonio en esta hermosa parroquia frente al mar.',
      icon: Church,
      embedUrl: 'https://maps.google.com/maps?q=Parroquia%20Padre%20Pio%20de%20Pietrelcina,%20S%C3%A1nchez%20de%20Bustamante%203850,%20Mar%20del%20Plata&t=&z=16&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Parroquia+Padre+Pio+de+Pietrelcina+Sanchez+de+Bustamante+3850+Mar+del+Plata',
    },
    {
      id: 'celebracion',
      title: 'La Celebración',
      subtitle: 'En Nuestro Jardín',
      time: '14:00 hs',
      placeName: 'Casa Quinta Familiar',
      address: 'Abihail P. Borthaburu 4063, Faro Norte, Mar del Plata, Argentina',
      details: '¡A festejar! Nos reunimos en nuestro jardín para compartir un almuerzo lleno de música, risas y baile.',
      icon: Sparkles,
      embedUrl: 'https://maps.google.com/maps?q=Abihail%20P.%20Borthaburu%204063,%20Mar%20del%20Plata&t=&z=16&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Abihail+P+Borthaburu+4063+Mar+del+Plata',
    }
  ];

  const handleCopyAddress = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeLoc = locations.find(loc => loc.id === activeTab) || locations[0];
  const ActiveIcon = activeLoc.icon;

  return (
    <div className="bg-white rounded-2xl border border-olive-200/40 shadow-md p-5 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch" id="location-interactive-card">
      {/* Location Selector & Info */}
      <div className="w-full md:w-5/12 flex flex-col justify-between" id="location-text-details">
        <div>
          <h3 className="font-serif text-2xl text-olive-900 font-light mb-1">
            Ubicación y Horarios
          </h3>
          <p className="font-sans text-xs text-gray-500 tracking-wider mb-6">
            Te facilitamos los datos para que llegues sin problemas
          </p>

          {/* Tab buttons */}
          <div className="flex bg-olive-100/50 p-1 rounded-xl mb-6" id="location-tabs-nav">
            {locations.map(loc => {
              const TabIcon = loc.icon;
              return (
                <button
                  key={loc.id}
                  id={`tab-btn-${loc.id}`}
                  onClick={() => setActiveTab(loc.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${activeTab === loc.id ? 'bg-white text-olive-800 shadow-sm' : 'text-gray-500 hover:text-olive-700'}`}
                >
                  <TabIcon className="w-4 h-4" />
                  {loc.id === 'ceremonia' ? 'Ceremonia' : 'Fiesta'}
                </button>
              );
            })}
          </div>

          {/* Active Location Info Card */}
          <div className="space-y-4" id={`location-info-block-${activeLoc.id}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-olive-50 border border-olive-200/40 text-olive-600">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-medium text-olive-800">
                  {activeLoc.title}
                </h4>
                <p className="text-xs font-semibold text-gold-600 font-sans tracking-widest uppercase">
                  {activeLoc.time}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed italic">
              "{activeLoc.details}"
            </p>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-olive-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-olive-900">
                    {activeLoc.subtitle}
                  </p>
                  <p className="text-xs text-gray-500 leading-normal">
                    {activeLoc.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3" id="location-actions">
          <a
            id={`btn-directions-${activeLoc.id}`}
            href={activeLoc.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-olive-500 hover:bg-olive-600 text-white font-semibold font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-xl shadow-md shadow-olive-500/15 hover:scale-[1.02] transition-all duration-200"
          >
            <Compass className="w-4 h-4" />
            Cómo llegar
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            id={`btn-copy-address-${activeLoc.id}`}
            onClick={() => handleCopyAddress(activeLoc.address, activeLoc.id)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-olive-50 border border-olive-200 text-olive-700 font-semibold font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-xl transition-colors duration-200"
          >
            {copiedId === activeLoc.id ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Dirección
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Embed Panel */}
      <div className="w-full md:w-7/12 min-h-[300px] md:min-h-auto rounded-xl overflow-hidden border border-olive-200/40 relative shadow-inner bg-olive-50" id="map-embed-wrapper">
        <iframe
          id={`iframe-map-${activeLoc.id}`}
          title={`Mapa de ${activeLoc.title}`}
          src={activeLoc.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '350px' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full object-cover transition-opacity duration-300"
        ></iframe>
      </div>
    </div>
  );
}
