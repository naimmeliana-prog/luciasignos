import React, { useEffect, useState } from 'react';
import { Bell, Trophy, X } from 'lucide-react';
import { Navbar, AppSection } from './components/Navbar';
import { LessonCatalog } from './components/LessonCatalog';
import { GlossaryView } from './components/GlossaryView';
import { FingerspellingPractice } from './components/FingerspellingPractice';
import { FacialPracticeStudio } from './components/FacialPracticeStudio';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AuthModal } from './components/AuthModal';
import { getActiveStudentSession } from './services/authService';
import {
  loadStudentProgress,
  recordFacialChallengeSuccess,
  recordFingerspellingExercise,
  recordGlossaryTermMastered,
  recordLessonCompletion,
  resetStudentProgressToZero,
  saveLessonNote,
  saveStudentProgress
} from './services/progressService';
import {
  AchievementToast,
  ReminderSettings,
  StudentProgressState,
  StudentUser
} from './types/learning';

const GUEST_STORAGE_ID = 'guest-local';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('lecciones');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() =>
    getActiveStudentSession()
  );
  const [progress, setProgress] = useState<StudentProgressState>(() =>
    loadStudentProgress(getActiveStudentSession()?.id || GUEST_STORAGE_ID)
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [motivationBanner, setMotivationBanner] = useState<string | null>(null);
  const [achievementToast, setAchievementToast] =
    useState<AchievementToast | null>(null);

  const showAchievement = (toast?: AchievementToast) => {
    if (!toast) return;
    setAchievementToast(toast);
    setTimeout(() => {
      setAchievementToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 5000);
  };

  const handleAuthChange = (user: StudentUser | null) => {
    setCurrentUser(user);
    const targetId = user?.id || GUEST_STORAGE_ID;
    setProgress(loadStudentProgress(targetId));
  };

  useEffect(() => {
    const checkSchedule = () => {
      if (!progress.reminder.enabled) return;
      const now = new Date();
      const currentDay = now.getDay();
      if (!progress.reminder.daysOfWeek.includes(currentDay)) return;

      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hh}:${mm}`;
      const todayDate = now.toISOString().split('T')[0];

      if (
        currentTimeStr === progress.reminder.timeOfDay &&
        progress.reminder.lastTriggeredDate !== todayDate
      ) {
        setMotivationBanner(progress.reminder.customMotivationMessage);
        const nextState: StudentProgressState = {
          ...progress,
          reminder: {
            ...progress.reminder,
            lastTriggeredDate: todayDate
          }
        };
        setProgress(nextState);
        saveStudentProgress(nextState);
      }
    };

    const timer = setInterval(checkSchedule, 30000);
    return () => clearInterval(timer);
  }, [progress]);

  const handleCompleteLesson = (
    lessonId: string,
    quizScore: number,
    durationMinutes: number
  ) => {
    const { nextState, toast } = recordLessonCompletion(
      progress,
      lessonId,
      quizScore,
      durationMinutes
    );
    setProgress(nextState);
    showAchievement(toast);
  };

  const handleSaveNote = (
    lessonId: string,
    note: string,
    bookmarked?: boolean
  ) => {
    const updated = saveLessonNote(progress, lessonId, note, bookmarked);
    setProgress(updated);
  };

  const handleCompleteFacialChallenge = (challengeId: string, score: number) => {
    const { nextState, toast } = recordFacialChallengeSuccess(
      progress,
      challengeId,
      score
    );
    setProgress(nextState);
    showAchievement(toast);
  };

  const handleToggleGlossaryMastered = (termId: string, termName: string) => {
    const { nextState, toast } = recordGlossaryTermMastered(
      progress,
      termId,
      termName
    );
    setProgress(nextState);
    showAchievement(toast);
  };

  const handleFingerspellingResult = (
    mode: 'guess_word' | 'spell_word' | 'rapid_letter',
    isCorrect: boolean
  ) => {
    const { nextState, toast } = recordFingerspellingExercise(
      progress,
      mode,
      isCorrect
    );
    setProgress(nextState);
    if (toast) {
      showAchievement(toast);
    }
  };

  const handleRecordOfflineDownload = (guideId: string) => {
    const setIds = new Set(progress.DownloadedGuideIds);
    setIds.add(guideId);
    const updated: StudentProgressState = {
      ...progress,
      DownloadedGuideIds: Array.from(setIds)
    };
    setProgress(updated);
    saveStudentProgress(updated);
  };

  const handleUpdateReminder = (reminder: ReminderSettings) => {
    const updated: StudentProgressState = {
      ...progress,
      reminder
    };
    setProgress(updated);
    saveStudentProgress(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        xpPoints={progress.xpPoints}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Celebratory Achievement Notification Banner */}
      {achievementToast && (
        <div
          className="bg-emerald-950 text-white px-6 py-3 border-b border-emerald-800 transition-all"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white">
                  {achievementToast.title}
                </span>
                <span className="mx-2 text-emerald-400">·</span>
                <span className="text-emerald-100">
                  {achievementToast.message}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {achievementToast.xpGained > 0 && (
                <span className="font-mono font-bold text-amber-300 tabular-nums">
                  +{achievementToast.xpGained} XP
                </span>
              )}
              <button
                type="button"
                onClick={() => setAchievementToast(null)}
                className="p-1 text-emerald-300 hover:text-white cursor-pointer"
                aria-label="Cerrar notificación de logro"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Daily Reminder Toast Banner */}
      {motivationBanner && (
        <div className="bg-sky-900 text-white px-6 py-3 border-b border-sky-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-sky-300 shrink-0" />
              <span>
                <strong>Recordatorio de Estudio:</strong> {motivationBanner}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMotivationBanner(null)}
              className="p-1 text-sky-200 hover:text-white cursor-pointer"
              aria-label="Cerrar recordatorio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'lecciones' && (
          <LessonCatalog
            progress={progress}
            currentUser={currentUser}
            onCompleteLesson={handleCompleteLesson}
            onSaveNote={handleSaveNote}
            onOpenFacialPractice={() => setActiveSection('practica_facial')}
            onRecordGvaScore={(examId, score) => {
              const updated: StudentProgressState = {
                ...progress,
                gvaExamScores: {
                  ...progress.gvaExamScores,
                  [examId]: score
                }
              };
              setProgress(updated);
              saveStudentProgress(updated);
            }}
          />
        )}

        {activeSection === 'glosario' && (
          <GlossaryView
            progress={progress}
            onToggleMastered={handleToggleGlossaryMastered}
          />
        )}

        {activeSection === 'deletreo' && (
          <FingerspellingPractice
            progress={progress}
            onExerciseResult={handleFingerspellingResult}
          />
        )}

        {activeSection === 'practica_facial' && (
          <FacialPracticeStudio
            progress={progress}
            onCompleteChallenge={handleCompleteFacialChallenge}
          />
        )}

        {activeSection === 'progreso' && (
          <ProgressDashboard
            progress={progress}
            currentUser={currentUser}
            onSelectLessonFromProgress={() => setActiveSection('lecciones')}
            onRecordOfflineDownload={handleRecordOfflineDownload}
            onUpdateReminder={handleUpdateReminder}
            onTriggerInAppMotivation={(msg) => setMotivationBanner(msg)}
            onResetProgressToZero={() => {
              const resetState = resetStudentProgressToZero(
                currentUser?.id || GUEST_STORAGE_ID
              );
              setProgress(resetState);
              showAchievement({
                id: `rst-${Date.now()}`,
                title: 'Contadores puestos a cero',
                message: 'Todo el progreso, XP, rachas e insignias se han reiniciado a 0.',
                xpGained: 0
              });
            }}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            LuciaSignos — Plataforma interactiva de aprendizaje de lengua de signos y preparación GVA.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveSection('lecciones')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Lecciones y Exámenes GVA
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('glosario')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Glosario Interactivo
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('deletreo')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Deletreo Manual
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('practica_facial')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Reconocimiento Facial
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('progreso')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Logros y Descargas
            </button>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthChange}
      />
    </div>
  );
}
