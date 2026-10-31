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

        {/* Visual Editorial Illustration Card (Zero-Broken-Image Policy Resilient SVG Showcase) */}
        <div className="lg:col-span-5 rounded-xl bg-slate-900 text-white p-6 flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MÉTODO VISUAL 360°</span>
            <span>SIN REDIRECCIONES EXTERNAS</span>
          </div>

          <div className="my-4 flex items-center justify-center">
            <svg
              viewBox="0 0 320 150"
              className="w-full max-w-xs h-36"
              role="img"
              aria-label="Ilustración de comunicación en lengua de signos"
            >
              <rect x="8" y="8" width="304" height="134" rx="12" fill="#1e293b" />
              {/* Left communicative hand */}
              <g transform="translate(86, 78) rotate(-14)">
                <circle cx="0" cy="0" r="32" fill="rgba(56, 189, 248, 0.14)" />
                <rect x="-14" y="-8" width="28" height="26" rx="6" fill="#ffdbac" stroke="#38bdf8" strokeWidth="2" />
                <rect x="-12" y="-28" width="5" height="22" rx="2.5" fill="#ffdbac" />
                <rect x="-5" y="-32" width="5" height="26" rx="2.5" fill="#ffdbac" />
                <rect x="2" y="-30" width="5" height="24" rx="2.5" fill="#ffdbac" />
                <rect x="9" y="-25" width="5" height="19" rx="2.5" fill="#ffdbac" />
              </g>
              {/* Connection wave */}
              <path
                d="M 125 68 Q 160 42 195 68"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
              {/* Right communicative hand */}
              <g transform="translate(234, 78) rotate(14)">
                <circle cx="0" cy="0" r="32" fill="rgba(20, 184, 166, 0.14)" />
                <rect x="-14" y="-8" width="28" height="26" rx="6" fill="#ffdbac" stroke="#14b8a6" strokeWidth="2" />
                <rect x="-12" y="-28" width="5" height="22" rx="2.5" fill="#ffdbac" />
                <rect x="-5" y="-32" width="5" height="26" rx="2.5" fill="#ffdbac" />
                <rect x="2" y="-30" width="5" height="24" rx="2.5" fill="#ffdbac" />
                <rect x="9" y="-25" width="5" height="19" rx="2.5" fill="#ffdbac" />
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
