import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FlipHorizontal, Camera } from 'lucide-react';
import { Lesson } from '../types/learning';

interface RealisticSignPlayerProps {
  lesson: Lesson;
}

const SPECIFIC_SIGN_PHOTOS: Record<string, string> = {
  'lec-01-saludos': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80', // saludo / cordial
  'lec-02-dactilologia': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', // manos / dactilología
  'lec-03-familia': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80', // familia
  'lec-04-cotidiano': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80', // cotidiano / agua
  'lec-05-gva-a1-a2': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', // examen / estudio
  'lec-06-verbos-espaciales': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80', // espacio / direccional
  'lec-07-mnm-avanzados': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80', // expresión facial
  'lec-08-gva-b1-b2': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80', // avanzado GVA
  // Glossary entries
  'glos-hola': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  'glos-gracias': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'glos-por-favor': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
  'glos-amiga': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
  'glos-familia': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
  'glos-casa': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'glos-agua': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'glos-cafe': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'glos-aprender': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'glos-entender': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'glos-que': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
  'glos-donde': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
  'glos-ayudar': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
  'glos-medico': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80'
};

const DEFAULT_REALISTIC_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80'
];

export const RealisticSignPlayer: React.FC<RealisticSignPlayerProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const keyframes = lesson.keyframes || [];
  const totalSteps = Math.max(1, keyframes.length);

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return;
    const intervalMs = Math.max(1400, 2800 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % totalSteps);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, playbackSpeed]);

  const specificUrl = SPECIFIC_SIGN_PHOTOS[lesson.id] || lesson.realisticPhotoUrl || DEFAULT_REALISTIC_PHOTOS[currentIdx % DEFAULT_REALISTIC_PHOTOS.length];
  const activePhase = keyframes[currentIdx]?.phaseLabel || `Demostración en vivo de ${lesson.title}`;

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-sm">
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        <img
          src={specificUrl}
          alt={lesson.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            mirrorMode ? 'scale-x-[-1]' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-teal-300 font-mono flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>FOTOGRAFÍA REAL DE REFERENCIA (LSE)</span>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-200 font-mono">
            {activePhase}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar Secuencia' : 'Reproducir'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentIdx(0)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMirrorMode((m) => !m)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              mirrorMode
                ? 'bg-teal-950 border-teal-500 text-teal-200'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Modo Espejo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
