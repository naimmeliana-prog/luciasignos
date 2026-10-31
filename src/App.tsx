import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Navbar, AppSection } from './components/Navbar';
import { LessonCatalog } from './components/LessonCatalog';
import { FacialPracticeStudio } from './components/FacialPracticeStudio';
import { ProgressDashboard } from './components/ProgressDashboard';
import { OfflineMaterials } from './components/OfflineMaterials';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import {
  ensureDemoStudentAccount,
  getActiveStudentSession,
  setActiveStudentSession
} from './services/authService';
import {
  loadStudentProgress,
  recordFacialChallengeSuccess,
  recordLessonCompletion,
  saveLessonNote,
  saveStudentProgress
} from './services/progressService';
import {
  ReminderSettings,
  StudentProgressState,
  StudentUser
} from './types/learning';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('lecciones');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() =>
    getActiveStudentSession()
  );
  const [progress, setProgress] = useState<StudentProgressState>(() =>
    loadStudentProgress(getActiveStudentSession()?.id || 'stu-clara-demo')
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [motivationBanner, setMotivationBanner] = useState<string | null>(null);

  // Initialize default student account if none is logged in so the user's friend can start immediately
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const existing = getActiveStudentSession();
      if (!existing) {
        const demo = await ensureDemoStudentAccount();
        if (mounted) {
          setActiveStudentSession(demo);
          setCurrentUser(demo);
          setProgress(loadStudentProgress(demo.id));
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Switch progress record when user changes
  const handleAuthChange = (user: StudentUser | null) => {
    setCurrentUser(user);
    const targetId = user?.id || 'stu-clara-demo';
    setProgress(loadStudentProgress(targetId));
  };

  // Check daily reminder schedule every 60 seconds
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
    const updated = recordLessonCompletion(
      progress,
      lessonId,
      quizScore,
      durationMinutes
    );
    setProgress(updated);
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
    const updated = recordFacialChallengeSuccess(progress, challengeId, score);
    setProgress(updated);
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

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
          />
        )}

        {activeSection === 'material_offline' && (
          <OfflineMaterials
            progress={progress}
            currentUser={currentUser}
            onRecordDownload={handleRecordOfflineDownload}
          />
        )}

        {activeSection === 'recordatorios' && (
          <NotificationCenter
            progress={progress}
            onUpdateReminder={handleUpdateReminder}
            onTriggerInAppMotivation={(msg) => setMotivationBanner(msg)}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            SignaViva — Plataforma interactiva de aprendizaje de lengua de signos.
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveSection('lecciones')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Catálogo de Lecciones
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('practica_facial')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Laboratorio Facial
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('material_offline')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Descargas Offline
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
