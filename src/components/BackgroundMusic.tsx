/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/Among The Stars - Everet Almond.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const startPlayback = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          cleanupListeners();
        })
        .catch((err) => {
          console.log("Autoplay bloqueado por políticas del navegador. Esperando interacción...");
          setIsPlaying(false);
        });
    };

    // Intentar reproducir inmediatamente
    startPlayback();

    // Fallback: reproducir ante la primera interacción del usuario en la pantalla
    const handleInteraction = () => {
      startPlayback();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      cleanupListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.log("Autoplay blocked or playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div 
      id="background-music-container"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-olive-200/50 hover:border-olive-500/30 transition-all duration-300"
    >
      <button
        id="btn-music-play-pause"
        onClick={togglePlay}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${isPlaying ? 'bg-olive-500 text-white animate-spin-slow' : 'bg-olive-100 text-olive-700'} hover:scale-105 transition-all duration-300`}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? <Music className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {isPlaying && (
        <div className="flex flex-col pr-1" id="music-info-label">
          <span className="text-[10px] font-medium tracking-wider text-olive-800 font-sans uppercase">
            Música de Fondo
          </span>
          <span className="text-[9px] text-gray-500 truncate w-32" title="Among The Stars - Everet Almond">
            Among The Stars - Everet Almond
          </span>
        </div>
      )}

      {isPlaying && (
        <button
          id="btn-music-mute"
          onClick={toggleMute}
          className="p-1 text-gray-400 hover:text-olive-700 transition-colors"
          title={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}
