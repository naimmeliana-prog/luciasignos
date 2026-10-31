import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FlipHorizontal, Camera, Sparkles } from 'lucide-react';
import { Lesson } from '../types/learning';

interface RealisticSignPlayerProps {
  lesson: Lesson;
}

const REALISTIC_SIGNER_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85'
];

export const RealisticSignPlayer: React.FC<RealisticSignPlayerProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const keyframes = lesson.keyframes && lesson.keyframes.length > 0 ? lesson.keyframes : [
    { phaseLabel: 'Fase 1: Preparación y postura inicial' },
    { phaseLabel: 'Fase 2: Ejecución y proyección del signo' }
  ];

  const totalSteps = keyframes.length;

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return;
    const intervalMs = Math.max(1800, 3500 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % totalSteps);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, playbackSpeed]);

  const activePhoto = REALISTIC_SIGNER_PHOTOS[(lesson.id.charCodeAt(0) + currentIdx) % REALISTIC_SIGNER_PHOTOS.length];
  const phaseLabel = keyframes[currentIdx]?.phaseLabel || `Demostración real de ${lesson.title}`;

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-teal-500/30 shadow-md">
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        <img
          src={activePhoto}
          alt={lesson.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            mirrorMode ? 'scale-x-[-1]' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/50 pointer-events-none" />

        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur px-3.5 py-1.5 rounded-lg border border-teal-500/50 text-xs text-teal-300 font-mono flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>FOTOGRAFÍA REAL DE INTÉRPRETE LSE</span>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-teal-200 font-mono">
            {phaseLabel}
          </div>
        </div>

        {/* Phase progress indicators */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          {keyframes.map((kf, idx) => (
            <button
              key={kf.phaseLabel}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`flex-1 h-1.5 rounded-full transition-colors cursor-pointer ${
                idx === currentIdx ? 'bg-teal-400' : 'bg-white/30 hover:bg-white/50'
              }`}
              title={kf.phaseLabel}
            />
          ))}
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
            <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentIdx(0)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>

          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            {[0.75, 1, 1.25].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 text-xs font-mono tabular-nums rounded-md cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
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
