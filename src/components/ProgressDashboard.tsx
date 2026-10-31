import React from 'react';
import { Award, Calendar, CheckCircle2, Clock, Download } from 'lucide-react';
import { LESSONS_CURRICULUM, FACIAL_CHALLENGES } from '../data/curriculum';
import { StudentProgressState, StudentUser } from '../types/learning';

interface ProgressDashboardProps {
  progress: StudentProgressState;
  currentUser: StudentUser | null;
  onSelectLessonFromProgress: (lessonId: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  currentUser,
  onSelectLessonFromProgress
}) => {
  const completedLessons = LESSONS_CURRICULUM.filter(
    (l) => progress.lessons[l.id]?.completed
  );
  const completionRate = Math.round(
    (completedLessons.length / LESSONS_CURRICULUM.length) * 100
  );

  const levelBreakdown = (['inicial', 'intermedio', 'avanzado'] as const).map((lvl) => {
    const total = LESSONS_CURRICULUM.filter((l) => l.level === lvl).length;
    const done = LESSONS_CURRICULUM.filter(
      (l) => l.level === lvl && progress.lessons[l.id]?.completed
    ).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { level: lvl, total, done, pct };
  });

  const handleExportProgressJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      student: currentUser,
      progress
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso-signaviva-${currentUser?.name.toLowerCase().replace(/\s+/g, '-') || 'estudiante'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono text-slate-500 mb-1">
            EXPEDIENTE ACADÉMICO Y SEGUIMIENTO DIARIO
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Progreso de {currentUser ? currentUser.name : 'Estudiante'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulta tu evolución por niveles, puntuaciones de precisión facial y constancia de estudio diario.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportProgressJson}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Respaldo de Progreso (JSON)</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dominio del Curso</span>
            <Award className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {completionRate}%
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-sky-600"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Racha Actual</span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {progress.currentStreakDays} días
          </div>
          <div className="text-xs text-slate-500 mt-3 tabular-nums">
            Mejor racha histórica: {progress.longestStreakDays} días
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tiempo de Estudio</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {progress.totalMinutesStudied} min
          </div>
          <div className="text-xs text-slate-500 mt-3 tabular-nums">
            Objetivo diario: {currentUser?.dailyGoalMinutes || 15} min/día
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Expresión Facial (MNM)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {progress.completedFacialChallenges.length} / {FACIAL_CHALLENGES.length}
          </div>
          <div className="text-xs text-slate-500 mt-3">
            Retos superados con cámara
          </div>
        </div>
      </div>

      {/* Level Progression Bars */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Avance por Nivel de Competencia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levelBreakdown.map((item) => (
            <div key={item.level} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-900 capitalize">
                  Nivel {item.level}
                </span>
                <span className="font-mono text-slate-600 tabular-nums">
                  {item.done} / {item.total} lecciones ({item.pct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Curriculum Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Desglose de Lecciones y Calificaciones
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-semibold">Lección</th>
                <th className="py-3 px-4 font-semibold">Nivel y Categoría</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold">Comprensión</th>
                <th className="py-3 px-4 font-semibold">Notas Personales</th>
                <th className="py-3 px-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {LESSONS_CURRICULUM.map((lesson) => {
                const rec = progress.lessons[lesson.id];
                const isDone = Boolean(rec?.completed);
                return (
                  <tr key={lesson.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {lesson.number}. {lesson.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {lesson.level} · {lesson.category}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {isDone ? (
                        <span className="text-emerald-700">✓ Completada</span>
                      ) : (
                        <span className="text-slate-500">En curso</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                      {rec?.quizScore ? `${rec.quizScore}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {rec?.notes || 'Sin apuntes'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectLessonFromProgress(lesson.id)}
                        className="text-sky-700 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Repasar lección
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
