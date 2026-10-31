import React, { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Trophy,
  Sparkles,
  Bell
} from 'lucide-react';
import { LESSONS_CURRICULUM, FACIAL_CHALLENGES } from '../data/curriculum';
import {
  COMMUNITY_LEADERBOARD_BASE,
  GAMIFICATION_BADGES,
  LeaderboardEntry
} from '../data/glossaryAndDactylology';
import {
  ReminderSettings,
  StudentProgressState,
  StudentUser
} from '../types/learning';
import { OfflineMaterials } from './OfflineMaterials';
import { NotificationCenter } from './NotificationCenter';

interface ProgressDashboardProps {
  progress: StudentProgressState;
  currentUser: StudentUser | null;
  onSelectLessonFromProgress: (lessonId: string) => void;
  onRecordOfflineDownload: (guideId: string) => void;
  onUpdateReminder: (reminder: ReminderSettings) => void;
  onTriggerInAppMotivation: (message: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  currentUser,
  onSelectLessonFromProgress,
  onRecordOfflineDownload,
  onUpdateReminder,
  onTriggerInAppMotivation
}) => {
  const [subTab, setSubTab] = useState<
    'gamificacion_progreso' | 'material_offline' | 'recordatorios'
  >('gamificacion_progreso');

  const completedLessons = LESSONS_CURRICULUM.filter(
    (l) => progress.lessons[l.id]?.completed
  );
  const completionRate = Math.round(
    (completedLessons.length / LESSONS_CURRICULUM.length) * 100
  );

  // Student Rank Calculation based on XP
  const studentRankInfo = useMemo(() => {
    const xp = progress.xpPoints;
    if (xp >= 700) {
      return {
        rankNumber: 5,
        title: 'Comunicadora Experta',
        nextXp: 1000,
        prevXp: 700
      };
    }
    if (xp >= 500) {
      return {
        rankNumber: 4,
        title: 'Signante Avanzada',
        nextXp: 700,
        prevXp: 500
      };
    }
    if (xp >= 300) {
      return {
        rankNumber: 3,
        title: 'Intérprete en Progreso',
        nextXp: 500,
        prevXp: 300
      };
    }
    if (xp >= 150) {
      return {
        rankNumber: 2,
        title: 'Exploradora Dactilológica',
        nextXp: 300,
        prevXp: 150
      };
    }
    return {
      rankNumber: 1,
      title: 'Aprendiz Visual',
      nextXp: 150,
      prevXp: 0
    };
  }, [progress.xpPoints]);

  const rankProgressPct = Math.min(
    100,
    Math.round(
      ((progress.xpPoints - studentRankInfo.prevXp) /
        (studentRankInfo.nextXp - studentRankInfo.prevXp)) *
        100
    )
  );

  // Merge current student into the Leaderboard and sort by XP descending
  const sortedLeaderboard: LeaderboardEntry[] = useMemo(() => {
    const studentEntry: LeaderboardEntry = {
      id: currentUser?.id || 'stu-current',
      name: currentUser ? `${currentUser.name} (Tú)` : 'Clara Martínez (Tú)',
      avatarInitials: currentUser?.avatarInitials || 'CM',
      levelLabel: `Rango ${studentRankInfo.rankNumber} · ${studentRankInfo.title}`,
      xpPoints: progress.xpPoints,
      streakDays: progress.currentStreakDays,
      badgesCount: progress.unlockedBadgeIds.length,
      isCurrentUser: true
    };
    return [...COMMUNITY_LEADERBOARD_BASE, studentEntry].sort(
      (a, b) => b.xpPoints - a.xpPoints
    );
  }, [
    currentUser,
    studentRankInfo,
    progress.xpPoints,
    progress.currentStreakDays,
    progress.unlockedBadgeIds.length
  ]);

  const studentLeaderboardPosition =
    sortedLeaderboard.findIndex((e) => e.isCurrentUser) + 1;

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
    a.download = `progreso-signaviva-${
      currentUser?.name.toLowerCase().replace(/\s+/g, '-') || 'estudiante'
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Sub-navigation bar for Progress & Gamification / Offline Materials / Daily Reminders */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubTab('gamificacion_progreso')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'gamificacion_progreso'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Logros, Clasificación y Expediente</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('material_offline')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'material_offline'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Material Descargable (Offline)</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('recordatorios')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'recordatorios'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Recordatorios Diarios</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportProgressJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Respaldo (.JSON)</span>
          </button>
        </div>
      </div>

      {subTab === 'material_offline' && (
        <OfflineMaterials
          progress={progress}
          currentUser={currentUser}
          onRecordDownload={onRecordOfflineDownload}
        />
      )}

      {subTab === 'recordatorios' && (
        <NotificationCenter
          progress={progress}
          onUpdateReminder={onUpdateReminder}
          onTriggerInAppMotivation={onTriggerInAppMotivation}
        />
      )}

      {subTab === 'gamificacion_progreso' && (
        <section className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          {/* Student Rank & XP Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-mono text-sky-400">
                SISTEMA DE GAMIFICACIÓN · RANGO {studentRankInfo.rankNumber} DE 5
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">
                {studentRankInfo.title} — {progress.xpPoints} Puntos XP
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Gana puntos XP completando lecciones en vídeo (+60 XP), retos de expresión facial (+45 XP), palabras de deletreo manual (+35 XP) y términos del glosario (+25 XP).
              </p>

              <div className="pt-2 max-w-md space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300 tabular-nums">
                  <span>Progreso al siguiente rango</span>
                  <span>
                    {progress.xpPoints} / {studentRankInfo.nextXp} XP ({rankProgressPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${rankProgressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick KPIs inside Banner */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-400">Posición Liga</div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                  #{studentLeaderboardPosition}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Clasificación</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-400">Insignias</div>
                <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums mt-1">
                  {progress.unlockedBadgeIds.length} / {GAMIFICATION_BADGES.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Desbloqueadas</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-400">Racha Activa</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                  {progress.currentStreakDays}d
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Estudio diario</div>
              </div>
            </div>
          </div>

          {/* Two-Column Gamification Grid: Unlockable Badges (7 cols) + Leaderboard (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Unlockable Badges Showcase */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Insignias y Hitos de Aprendizaje
                  </h2>
                  <p className="text-xs text-slate-500">
                    Desbloquea cada insignia para recibir su bonificación extra de puntos XP.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums">
                  {progress.unlockedBadgeIds.length} de {GAMIFICATION_BADGES.length} logradas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {GAMIFICATION_BADGES.map((badge) => {
                  const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-sky-50/50 border-sky-500/80'
                          : 'bg-slate-50/70 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-semibold ${
                              isUnlocked ? 'text-sky-800' : 'text-slate-500'
                            }`}
                          >
                            {isUnlocked ? '★ INSIGNIA DESBLOQUEADA' : '🔒 BLOQUEADA'}
                          </span>
                          <span className="font-mono font-semibold text-slate-700 tabular-nums">
                            +{badge.xpReward} XP
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {badge.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Requisito: {badge.requirementLabel}</span>
                        {isUnlocked && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Community Leaderboard */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Tabla de Clasificación
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comparativa de puntos XP, rachas e insignias de estudiantes.
                  </p>
                </div>
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Estudiante</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Racha</th>
                      <th className="py-2.5 px-3 font-semibold text-right">XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sortedLeaderboard.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={
                          row.isCurrentUser
                            ? 'bg-sky-50/90 font-semibold text-slate-900'
                            : 'hover:bg-slate-50'
                        }
                      >
                        <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                          0{idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                row.isCurrentUser
                                  ? 'bg-sky-700 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {row.avatarInitials}
                            </span>
                            <div className="min-w-0">
                              <div className="truncate text-slate-900">{row.name}</div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {row.badgesCount} insignias
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                          {row.streakDays}d
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-sky-800">
                          {row.xpPoints} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detailed Curriculum Progress Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Desglose Académico por Lección ({completionRate}% Completado)
              </h2>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                Palabras deletreadas:{' '}
                {progress.fingerspelling.wordsGuessed +
                  progress.fingerspelling.wordsSpelled}{' '}
                · Signos del glosario: {progress.glossaryMasteredIds.length} · Retos faciales:{' '}
                {progress.completedFacialChallenges.length}/{FACIAL_CHALLENGES.length}
              </div>
            </div>

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
      )}
    </div>
  );
};
