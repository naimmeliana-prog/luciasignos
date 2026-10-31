import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  Download,
  Bookmark,
  ChevronRight,
  Award
} from 'lucide-react';
import { LESSONS_CURRICULUM } from '../data/curriculum';
import {
  Lesson,
  SkillLevel,
  StudentProgressState,
  StudentUser
} from '../types/learning';
import { SignVideoPlayer } from './SignVideoPlayer';
import { downloadSingleLessonSheet } from '../services/offlineGenerator';

interface LessonCatalogProps {
  progress: StudentProgressState;
  currentUser: StudentUser | null;
  onCompleteLesson: (lessonId: string, quizScore: number, durationMinutes: number) => void;
  onSaveNote: (lessonId: string, note: string, bookmarked?: boolean) => void;
  onOpenFacialPractice: (expressionChallengeId?: string) => void;
}

export const LessonCatalog: React.FC<LessonCatalogProps> = ({
  progress,
  currentUser,
  onCompleteLesson,
  onSaveNote,
  onOpenFacialPractice
}) => {
  const [levelFilter, setLevelFilter] = useState<'todos' | SkillLevel>('todos');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS_CURRICULUM[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [noteDraft, setNoteDraft] = useState<string>(
    progress.lessons[LESSONS_CURRICULUM[0].id]?.notes || ''
  );
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  const filteredLessons = LESSONS_CURRICULUM.filter((l) =>
    levelFilter === 'todos' ? true : l.level === levelFilter
  );

  const activeLesson: Lesson =
    LESSONS_CURRICULUM.find((l) => l.id === selectedLessonId) || LESSONS_CURRICULUM[0];
  const activeRecord = progress.lessons[activeLesson.id];

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setNoteDraft(progress.lessons[lesson.id]?.notes || '');
    setNoteSavedToast(false);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    activeLesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const score =
      activeLesson.quiz.length > 0
        ? Math.round((correctCount / activeLesson.quiz.length) * 100)
        : 100;
    onCompleteLesson(activeLesson.id, score, activeLesson.durationMinutes);
  };

  const handleSavePersonalNote = () => {
    onSaveNote(activeLesson.id, noteDraft);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  const handleToggleBookmark = () => {
    onSaveNote(activeLesson.id, noteDraft, !activeRecord?.bookmarked);
  };

  const completedCount = Object.values(progress.lessons).filter((r) => r.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Hero Split Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="text-xs font-mono text-sky-700">
              ESCUELA INTERACTIVA DE LENGUA DE SIGNOS · DESDE CERO HASTA AVANZADO
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display leading-tight">
              Aprende a comunicarte con tus manos y tu expresión facial paso a paso.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Lecciones en vídeo integradas sin salir de la web, laboratorio de expresión facial por cámara en tiempo real y cuadernos descargables para estudiar sin conexión.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#aula-interactiva"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0"
            >
              Ir a la Lección Activa
            </a>
            <button
              type="button"
              onClick={() => onOpenFacialPractice()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Camera className="w-4 h-4 text-sky-700" />
              <span>Practicar Expresión con Cámara</span>
            </button>
          </div>
        </div>

        {/* Visual Editorial Illustration Card (Sculpted Anatomical Signers & Hands) */}
        <div className="lg:col-span-5 rounded-xl bg-slate-900 text-white p-6 flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESTUDIO VISUAL INTERACTIVO</span>
            <span>SIN REDIRECCIONES EXTERNAS</span>
          </div>

          <div className="my-3 flex items-center justify-center">
            <svg
              viewBox="0 0 380 200"
              className="w-full h-44 rounded-lg overflow-hidden"
              role="img"
              aria-label="Ilustración editorial de comunicación en lengua de signos"
            >
              <defs>
                <radialGradient id="heroStudioGlow" cx="50%" cy="45%" r="60%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="70%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#090d16" />
                </radialGradient>
                <linearGradient id="skinWarmA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde4cf" />
                  <stop offset="60%" stopColor="#f3c19d" />
                  <stop offset="100%" stopColor="#d99b72" />
                </linearGradient>
                <linearGradient id="skinWarmB" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f7d3b5" />
                  <stop offset="60%" stopColor="#e4ab83" />
                  <stop offset="100%" stopColor="#c5855c" />
                </linearGradient>
              </defs>

              <rect width="380" height="200" fill="url(#heroStudioGlow)" />

              {/* Subtle architectural studio light rays */}
              <circle cx="190" cy="95" r="78" fill="none" stroke="rgba(56, 189, 248, 0.14)" strokeWidth="1.2" />
              <circle cx="190" cy="95" r="108" fill="none" stroke="rgba(45, 212, 191, 0.09)" strokeWidth="1.2" />

              {/* Left Signer Portrait & Expressive Hand */}
              <g transform="translate(82, 108)">
                {/* Shoulders / Cardigan */}
                <path d="M-58 92 C-52 46, -28 36, 0 36 C28 36, 52 46, 58 92 Z" fill="#0284c7" />
                <path d="M-16 36 L0 54 L16 36 Z" fill="#f8fafc" />
                {/* Neck & Sculpted Head */}
                <rect x="-10" y="16" width="20" height="24" rx="6" fill="url(#skinWarmA)" />
                <path d="M-28 -18 C-32 -52, 32 -52, 28 -18 C27 6, 16 24, 0 28 C-16 24, -27 6, -28 -18 Z" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="1.2" />
                {/* Hair */}
                <path d="M-30 -14 C-34 -44, -14 -58, 6 -56 C24 -55, 34 -40, 30 -12 C24 -28, 12 -38, -6 -38 C-18 -38, -26 -28, -30 -14 Z" fill="#18181b" />
                {/* Expressive Eyebrows, Eyes & Smile */}
                <path d="M-17 -19 Q-11 -24 -5 -19" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M5 -19 Q11 -24 17 -19" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="-11" cy="-11" r="2.4" fill="#18181b" />
                <circle cx="11" cy="-11" r="2.4" fill="#18181b" />
                <path d="M-9 8 Q0 16 9 8" fill="none" stroke="#9f3e46" strokeWidth="2.2" strokeLinecap="round" />

                {/* Sculpted Articulated Signing Hand (Foreground Right) */}
                <g transform="translate(56, 2) rotate(-14)">
                  <circle cx="0" cy="-12" r="26" fill="rgba(56, 189, 248, 0.16)" />
                  <path
                    d="M-12 14 C-16 4, -15 -8, -12 -12 L11 -12 C14 -8, 15 4, 11 14 Z"
                    fill="url(#skinWarmA)"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  {/* 4 Tapered Fingers */}
                  <rect x="-11" y="-32" width="4.8" height="22" rx="2.4" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="0.9" />
                  <rect x="-5" y="-36" width="4.8" height="26" rx="2.4" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="0.9" />
                  <rect x="1" y="-34" width="4.8" height="24" rx="2.4" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="0.9" />
                  <rect x="7" y="-28" width="4.5" height="18" rx="2.2" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="0.9" />
                  {/* Thumb */}
                  <rect x="-18" y="-14" width="5" height="16" rx="2.5" transform="rotate(-32 -15 -6)" fill="url(#skinWarmA)" stroke="#8c583a" strokeWidth="0.9" />
                </g>
              </g>

              {/* Visual Dialogue Connection Arc */}
              <path
                d="M 152 84 Q 190 52 228 84"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeDasharray="5 4"
              />
              <path
                d="M 158 106 Q 190 128 222 106"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />

              {/* Right Signer Portrait & Expressive Hand */}
              <g transform="translate(298, 108)">
                <path d="M-58 92 C-52 46, -28 36, 0 36 C28 36, 52 46, 58 92 Z" fill="#0d9488" />
                <path d="M-16 36 L0 54 L16 36 Z" fill="#f8fafc" />
                <rect x="-10" y="16" width="20" height="24" rx="6" fill="url(#skinWarmB)" />
                <path d="M-28 -18 C-32 -52, 32 -52, 28 -18 C27 6, 16 24, 0 28 C-16 24, -27 6, -28 -18 Z" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="1.2" />
                <path d="M-30 -12 C-34 -46, -12 -58, 8 -55 C26 -52, 34 -38, 30 -10 C22 -28, 8 -36, -8 -36 C-20 -36, -26 -26, -30 -12 Z" fill="#27272a" />
                <path d="M-17 -20 Q-11 -25 -5 -20" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M5 -20 Q11 -25 17 -20" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="-11" cy="-11" r="2.4" fill="#18181b" />
                <circle cx="11" cy="-11" r="2.4" fill="#18181b" />
                <path d="M-9 8 Q0 16 9 8" fill="none" stroke="#9f3e46" strokeWidth="2.2" strokeLinecap="round" />

                {/* Sculpted Articulated Signing Hand (Foreground Left) */}
                <g transform="translate(-56, 2) rotate(14)">
                  <circle cx="0" cy="-12" r="26" fill="rgba(45, 212, 191, 0.16)" />
                  <path
                    d="M-11 14 C-15 4, -14 -8, -11 -12 L12 -12 C15 -8, 16 4, 12 14 Z"
                    fill="url(#skinWarmB)"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <rect x="-11.5" y="-28" width="4.5" height="18" rx="2.2" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="0.9" />
                  <rect x="-5.8" y="-34" width="4.8" height="24" rx="2.4" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="0.9" />
                  <rect x="0.2" y="-36" width="4.8" height="26" rx="2.4" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="0.9" />
                  <rect x="6.2" y="-32" width="4.8" height="22" rx="2.4" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="0.9" />
                  <rect x="13" y="-14" width="5" height="16" rx="2.5" transform="rotate(32 15 -6)" fill="url(#skinWarmB)" stroke="#7c4d32" strokeWidth="0.9" />
                </g>
              </g>
            </svg>
          </div>

          <div className="text-xs text-slate-300 flex items-center justify-between pt-3 border-t border-slate-800">
            <span>Progreso actual: {completedCount} de {LESSONS_CURRICULUM.length} lecciones</span>
            <span className="font-mono text-sky-400 tabular-nums">
              Racha: {progress.currentStreakDays} días
            </span>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Summary Strip Below Hero */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Lecciones Dominadas</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {completedCount} / {LESSONS_CURRICULUM.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Currículo progresivo</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Retos Faciales Superados</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {progress.completedFacialChallenges.length} / 4
          </div>
          <div className="text-xs text-slate-500 mt-1">Cámara en tiempo real</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Racha de Estudio Diario</div>
          <div className="text-2xl font-bold text-sky-700 font-mono tabular-nums mt-1">
            {progress.currentStreakDays} días
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Meta: {currentUser?.dailyGoalMinutes || 15} min/día
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Tiempo Total Invertido</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {progress.totalMinutesStudied} min
          </div>
          <div className="text-xs text-slate-500 mt-1">Práctica acumulada</div>
        </div>
      </section>

      {/* Interactive Classroom Workspace */}
      <section id="aula-interactiva" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Catálogo de Lecciones y Aula en Vídeo
            </h2>
            <p className="text-sm text-slate-600">
              Selecciona tu nivel y estudia cada signo con vídeo integrado, vectores de movimiento y autoevaluación.
            </p>
          </div>

          {/* Interactive Filter Controls (Segmented Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg self-start">
            {(
              [
                { id: 'todos', label: 'Todos los niveles' },
                { id: 'inicial', label: 'Inicial' },
                { id: 'intermedio', label: 'Intermedio' },
                { id: 'avanzado', label: 'Avanzado' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLevelFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  levelFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Lesson List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              const rec = progress.lessons[lesson.id];
              const isDone = Boolean(rec?.completed);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-sky-600 shadow-xs ring-1 ring-sky-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-slate-700">
                        {lesson.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{lesson.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{lesson.durationMinutes} min</span>
                    </div>
                    {isDone && (
                      <span className="text-emerald-700 font-semibold">✓ Completada</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {lesson.number}. {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{lesson.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Lesson Video Player + Study Modules (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Lesson Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>Lección {activeLesson.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">Nivel {activeLesson.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLesson.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{activeLesson.durationMinutes} min</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 font-display">
                    {activeLesson.number}. {activeLesson.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">{activeLesson.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      activeRecord?.bookmarked
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{activeRecord?.bookmarked ? 'Guardada' : 'Guardar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadSingleLessonSheet(
                        activeLesson,
                        currentUser?.name || 'Estudiante',
                        noteDraft
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Ficha Offline</span>
                  </button>
                </div>
              </div>

              {/* Embedded Interactive Sign Video Player */}
              <SignVideoPlayer lesson={activeLesson} />

              {/* Biomechanical Breakdown Grid */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Los 4 Parámetros Formacionales del Signo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="font-semibold text-slate-900 mb-1">
                      1. Configuración Manual (Queirema)
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeLesson.biomechanics.configuracionManual}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="font-semibold text-slate-900 mb-1">
                      2. Lugar de Articulación (Toponema)
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeLesson.biomechanics.ubicacionEspacial}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="font-semibold text-slate-900 mb-1">
                      3. Trayectoria y Movimiento (Kinema)
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeLesson.biomechanics.trayectoriaMovimiento}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="font-semibold text-slate-900 mb-1">
                      4. Expresión Facial (Marcador No Manual)
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeLesson.biomechanics.marcadorFacial}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vocabulary Table */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Vocabulario Desglosado en esta Lección
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Signo</th>
                        <th className="py-2.5 px-3 font-semibold">Mano</th>
                        <th className="py-2.5 px-3 font-semibold">Ubicación y Movimiento</th>
                        <th className="py-2.5 px-3 font-semibold">Expresión Facial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeLesson.vocabulary.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {item.word}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{item.handshape}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {item.location} · {item.movement}
                          </td>
                          <td className="py-2.5 px-3 text-sky-800 font-medium">
                            {item.nonManualMarker}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Camera Practice Callout Banner */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-sky-800">
                    PRÁCTICA CON CÁMARA RECOMENDADA
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {activeLesson.facialExercisePrompt}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenFacialPractice()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Ir al Reconocimiento Facial</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Quiz & Personal Notes Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Comprehension Check Quiz (7 cols) */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Comprobación Interactiva
                  </h3>
                  {activeRecord?.completed && (
                    <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
                      Mejor nota: {activeRecord.quizScore}%
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  {activeLesson.quiz.map((q, qIdx) => (
                    <div key={q.id} className="space-y-2">
                      <p className="text-xs font-semibold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          let styleClass =
                            'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                          if (isSelected) {
                            styleClass =
                              'bg-sky-50 border-sky-600 text-slate-900 font-medium';
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              styleClass =
                                'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium';
                            } else if (isSelected && !isCorrect) {
                              styleClass = 'bg-red-50 border-red-400 text-red-900';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                if (!quizSubmitted) {
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${styleClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                          <strong>Explicación:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
                    >
                      Completar Lección y Verificar Respuestas
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Lección registrada en tu progreso diario!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Study Notes (5 cols) */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Cuaderno Personal de Notas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Anota trucos visuales o dudas sobre esta lección. Tus apuntes se incluyen al descargar la ficha offline.
                  </p>
                  <textarea
                    rows={5}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Ej.: Recordar mantener las cejas elevadas al final de la pregunta..."
                    className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-800 focus:outline-2 focus:outline-sky-600"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleSavePersonalNote}
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Guardar Apuntes
                  </button>
                  {noteSavedToast && (
                    <span className="text-xs text-emerald-700 font-medium">
                      ✓ Guardado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
