import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  Download,
  Bookmark,
  ChevronRight,
  Award,
  BookOpen,
  FileCheck,
  Eye,
  Layers
} from 'lucide-react';
import { LESSONS_CURRICULUM, GVA_EXAM_BANK, LINGUISTIC_MODULES } from '../data/curriculum';
import {
  Lesson,
  SkillLevel,
  StudentProgressState,
  StudentUser,
  VisualMode
} from '../types/learning';
import { SignVideoPlayer } from './SignVideoPlayer';
import { RealisticSignPlayer } from './RealisticSignPlayer';
import { GrammarModuleView } from './GrammarModuleView';
import { downloadSingleLessonSheet } from '../services/offlineGenerator';

interface LessonCatalogProps {
  progress: StudentProgressState;
  currentUser: StudentUser | null;
  onCompleteLesson: (lessonId: string, quizScore: number, durationMinutes: number) => void;
  onSaveNote: (lessonId: string, note: string, bookmarked?: boolean) => void;
  onOpenFacialPractice: (expressionChallengeId?: string) => void;
  onToggleVisualMode: (mode: VisualMode) => void;
  onRecordGvaScore: (examId: string, score: number) => void;
}

export const LessonCatalog: React.FC<LessonCatalogProps> = ({
  progress,
  currentUser,
  onCompleteLesson,
  onSaveNote,
  onOpenFacialPractice,
  onToggleVisualMode,
  onRecordGvaScore
}) => {
  const [levelFilter, setLevelFilter] = useState<'todos' | SkillLevel>('todos');
  const [mainTab, setMainTab] = useState<'lecciones' | 'gva_examenes' | 'linguistica' | 'gramatica'>('lecciones');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS_CURRICULUM[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [noteDraft, setNoteDraft] = useState<string>(
    progress.lessons[LESSONS_CURRICULUM[0].id]?.notes || ''
  );
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  // GVA Exam practice state
  const [gvaAnswers, setGvaAnswers] = useState<Record<string, number>>({});
  const [gvaSubmitted, setGvaSubmitted] = useState<boolean>(false);

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

  const handleGvaSubmit = () => {
    setGvaSubmitted(true);
    let correct = 0;
    GVA_EXAM_BANK.forEach((eq) => {
      if (gvaAnswers[eq.id] === eq.correctIndex) correct++;
    });
    const pct = Math.round((correct / GVA_EXAM_BANK.length) * 100);
    onRecordGvaScore('gva-simulacro-general', pct);
    onCompleteLesson('lec-03-gva-a1-a2', pct, 15);
  };

  const completedCount = Object.values(progress.lessons).filter((r) => r.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Hero Split Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-sky-700">
                LUCIA-SIGNOS · CURSO OFICIAL LSE Y EXÁMENES GVA
              </div>
              {/* Visual Mode Selector Toggle (Illustrations vs Photos) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 px-2">Visual:</span>
                <button
                  type="button"
                  onClick={() => onToggleVisualMode('illustrations')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    progress.visualMode === 'illustrations'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ilustraciones
                </button>
                <button
                  type="button"
                  onClick={() => onToggleVisualMode('realistic')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    progress.visualMode === 'realistic'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fotos Reales
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display leading-tight">
              Aprende Lengua de Signos Española (LSE) y prepara los exámenes oficiales.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Lecciones en vídeo, simulacros de examen de la Generalitat Valenciana (A1-B2), gramática y sintaxis LSE, glosario interactivo y reconocimiento facial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMainTab('lecciones')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mainTab === 'lecciones'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lecciones de LSE
            </button>
            <button
              type="button"
              onClick={() => setMainTab('gva_examenes')}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mainTab === 'gva_examenes'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Exámenes GVA Oficiales</span>
            </button>
            <button
              type="button"
              onClick={() => setMainTab('linguistica')}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mainTab === 'linguistica'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Gramática y Sintaxis LSE</span>
            </button>
            <button
              type="button"
              onClick={() => setMainTab('gramatica')}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mainTab === 'gramatica'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Módulo Gramatical (SOV/Espacio)</span>
            </button>
          </div>
        </div>

        {/* Visual Editorial Illustration / Photo Preview Card */}
        <div className="lg:col-span-5 rounded-xl bg-slate-900 text-white p-6 flex flex-col justify-between border border-slate-800 overflow-hidden relative">
          {progress.visualMode === 'realistic' ? (
            <div className="absolute inset-0">
              <img
                src={activeLesson.realisticPhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                alt="Fotografía real de lengua de signos"
                className="w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
            </div>
          ) : null}

          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>MÉTODO VISUAL DE LUCIA-SIGNOS</span>
            <span>GVA OFICIAL · LSE</span>
          </div>

          <div className="relative z-10 my-4 flex items-center justify-center">
            {progress.visualMode === 'illustrations' ? (
              <svg
                viewBox="0 0 320 140"
                className="w-full max-w-xs h-32"
                role="img"
                aria-label="Ilustración anatómica"
              >
                <rect x="10" y="10" width="300" height="120" rx="10" fill="#1e293b" />
                <circle cx="100" cy="70" r="30" fill="rgba(56, 189, 248, 0.18)" />
                <path d="M 85 70 Q 100 45 115 70 Q 100 95 85 70 Z" fill="#fde4cf" stroke="#38bdf8" strokeWidth="2" />
                <path d="M 140 70 Q 190 45 240 70" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeDasharray="6 4" />
                <circle cx="220" cy="70" r="30" fill="rgba(45, 212, 191, 0.18)" />
                <path d="M 205 70 Q 220 45 235 70 Q 220 95 205 70 Z" fill="#f7d3b5" stroke="#2dd4bf" strokeWidth="2" />
              </svg>
            ) : (
              <div className="text-center py-6">
                <span className="inline-block px-3 py-1 bg-sky-900/80 text-sky-200 rounded-md text-xs font-mono">
                  Modo Fotografía Real Activo
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10 text-xs text-slate-300 flex items-center justify-between pt-3 border-t border-slate-800">
            <span>Progreso actual: {completedCount} de {LESSONS_CURRICULUM.length} lecciones</span>
            <span className="font-mono text-sky-400 tabular-nums">
              Racha: {progress.currentStreakDays} días
            </span>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Summary Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Lecciones Dominadas</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {completedCount} / {LESSONS_CURRICULUM.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Currículo GVA y LSE</div>
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

      {/* Main Tab: Lecciones de LSE */}
      {mainTab === 'lecciones' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Catálogo de Lecciones y Exámenes GVA
              </h2>
              <p className="text-sm text-slate-600">
                Selecciona tu nivel o simulacro oficial para estudiar con vídeo interactivo y fichas de teoría.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg self-start">
              {(
                [
                  { id: 'todos', label: 'Todos los niveles' },
                  { id: 'inicial', label: 'Inicial (A1)' },
                  { id: 'intermedio', label: 'Intermedio (B1)' },
                  { id: 'gva_oficial', label: 'Exámenes GVA' }
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

            {/* Right Column: Active Lesson Video Player & Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>Lección {activeLesson.number}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">Nivel {activeLesson.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeLesson.category}</span>
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

                {/* Visual Mode Animated Signer */}
                {progress.visualMode === 'realistic' ? (
                  <RealisticSignPlayer lesson={activeLesson} />
                ) : (
                  <SignVideoPlayer lesson={activeLesson} />
                )}

                {/* Biomechanical Breakdown */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Parámetros Formacionales del Signo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="font-semibold text-slate-900 mb-1">
                        1. Configuración Manual
                      </div>
                      <p className="text-slate-600">{activeLesson.biomechanics.configuracionManual}</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="font-semibold text-slate-900 mb-1">
                        2. Ubicación Espacial
                      </div>
                      <p className="text-slate-600">{activeLesson.biomechanics.ubicacionEspacial}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Comprobación Interactiva de Lección
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
                      Completar Lección y Registrar XP
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Lección completada y registrada en tu progreso!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Tab: Exámenes Oficiales GVA */}
      {mainTab === 'gva_examenes' && (
        <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-mono text-sky-700 mb-1">
                SIMULACRO DE PRUEBAS OFICIALES · GENERALITAT VALENCIANA
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Exámenes Oficiales de LSE (A1, A2, B1, B2)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pon a prueba tus conocimientos con preguntas basadas en las convocatorias oficiales de acreditación de la Generalitat Valenciana.
            </p>
          </div>

          <div className="space-y-6">
            {GVA_EXAM_BANK.map((eq, idx) => (
              <div key={eq.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>PREGUNTA OFICIAL GVA · NIVEL {eq.level}</span>
                  <span>Pregunta 0{idx + 1} de {GVA_EXAM_BANK.length}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{eq.question}</p>
                <div className="space-y-2">
                  {eq.options.map((opt, optIdx) => {
                    const selected = gvaAnswers[eq.id] === optIdx;
                    const correct = eq.correctIndex === optIdx;
                    let cls = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (selected) cls = 'bg-sky-50 border-sky-600 text-slate-900 font-medium';
                    if (gvaSubmitted) {
                      if (correct) cls = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium';
                      else if (selected && !correct) cls = 'bg-red-50 border-red-300 text-red-900';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (!gvaSubmitted) setGvaAnswers((p) => ({ ...p, [eq.id]: optIdx }));
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {gvaSubmitted && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200">
                    <strong>Criterio oficial GVA:</strong> {eq.explanation}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-2 flex items-center justify-between">
              {!gvaSubmitted ? (
                <button
                  type="button"
                  onClick={handleGvaSubmit}
                  className="px-6 py-3 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 cursor-pointer"
                >
                  Calificar Simulacro GVA y Sumar XP
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Simulacro GVA evaluado y registrado en tu expediente!</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Tab: Gramática y Sintaxis LSE */}
      {mainTab === 'linguistica' && (
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-mono text-sky-700 mb-1">
              LINGÜÍSTICA Y REGLAS PROPIAS DE LA LENGUA DE SIGNOS ESPAÑOLA
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Gramática, Sintaxis y Sistema de Reglas LSE
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Al igual que cualquier lengua oral, la LSE posee fonología propia, morfosintaxis espacial y reglas gramaticales codificadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LINGUISTIC_MODULES.map((mod) => (
              <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-sky-700">
                  <span>MÓDULO LINGÜÍSTICO · {mod.category.toUpperCase()}</span>
                  <span>{mod.subtitle}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.summary}</p>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {mod.contentMarkdown}
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-900 mb-1">
                    Conclusiones clave para examen GVA:
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {mod.keyTakeaways.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {mainTab === 'gramatica' && <GrammarModuleView progress={progress} />}
    </div>
  );
};
