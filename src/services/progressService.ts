import {
  StudentProgressState,
  LessonProgressRecord,
  SkillLevel,
  AchievementToast
} from '../types/learning';
import { LESSONS_CURRICULUM, FACIAL_CHALLENGES } from '../data/curriculum';
import { GAMIFICATION_BADGES } from '../data/glossaryAndDactylology';

const PROGRESS_PREFIX = 'signaviva_progress_v1_';

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function createInitialProgress(userId: string): StudentProgressState {
  const today = getTodayDateString();
  const lessonsMap: Record<string, LessonProgressRecord> = {};

  LESSONS_CURRICULUM.forEach((lesson, idx) => {
    lessonsMap[lesson.id] = {
      lessonId: lesson.id,
      completed: idx === 0,
      completedAt: idx === 0 ? new Date().toISOString() : undefined,
      quizScore: idx === 0 ? 100 : 0,
      facialPracticeScore: idx === 0 ? 92 : 0,
      notes:
        idx === 0
          ? 'Recordar proyectar "Gracias" desde el mentón manteniendo sonrisa.'
          : '',
      bookmarked: idx === 0
    };
  });

  return {
    userId,
    lessons: lessonsMap,
    completedFacialChallenges: ['fc-01-saludo-afectivo'],
    studyLogs: {
      [today]: {
        date: today,
        minutesStudied: 12,
        lessonsCompletedCount: 1,
        facialExercisesCount: 1
      }
    },
    currentStreakDays: 3,
    longestStreakDays: 5,
    totalMinutesStudied: 42,
    DownloadedGuideIds: [],
    reminder: {
      enabled: true,
      timeOfDay: '19:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      customMotivationMessage:
        '¡Hola! Dedica 10 minutos hoy a practicar tus signos y expresiones faciales. ¡Cada gesto suma!',
      browserPermissionGranted:
        typeof window !== 'undefined' && 'Notification' in window
          ? Notification.permission === 'granted'
          : false
    },
    xpPoints: 325,
    unlockedBadgeIds: [
      'badge-primer-paso',
      'badge-expresion-viva',
      'badge-racha-constante'
    ],
    glossaryMasteredIds: ['glos-hola', 'glos-gracias'],
    fingerspelling: {
      wordsGuessed: 1,
      wordsSpelled: 1,
      lettersRapidMatched: 4,
      currentStreak: 2,
      bestStreak: 2,
      adaptiveTier: 'inicial'
    }
  };
}

export function loadStudentProgress(userId: string): StudentProgressState {
  try {
    const raw = localStorage.getItem(`${PROGRESS_PREFIX}${userId}`);
    if (!raw) {
      const initial = createInitialProgress(userId);
      saveStudentProgress(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as StudentProgressState;
    LESSONS_CURRICULUM.forEach((lesson) => {
      if (!parsed.lessons[lesson.id]) {
        parsed.lessons[lesson.id] = {
          lessonId: lesson.id,
          completed: false,
          quizScore: 0,
          facialPracticeScore: 0,
          notes: '',
          bookmarked: false
        };
      }
    });

    // Migrate fields for existing profiles
    if (typeof parsed.xpPoints !== 'number') parsed.xpPoints = 325;
    if (!Array.isArray(parsed.unlockedBadgeIds)) {
      parsed.unlockedBadgeIds = ['badge-primer-paso', 'badge-expresion-viva'];
    }
    if (!Array.isArray(parsed.glossaryMasteredIds)) {
      parsed.glossaryMasteredIds = ['glos-hola', 'glos-gracias'];
    }
    if (!parsed.fingerspelling) {
      parsed.fingerspelling = {
        wordsGuessed: 1,
        wordsSpelled: 1,
        lettersRapidMatched: 4,
        currentStreak: 2,
        bestStreak: 2,
        adaptiveTier: 'inicial'
      };
    }

    return parsed;
  } catch {
    return createInitialProgress(userId);
  }
}

export function saveStudentProgress(state: StudentProgressState): void {
  localStorage.setItem(`${PROGRESS_PREFIX}${state.userId}`, JSON.stringify(state));
}

export function evaluateAndUnlockBadges(
  state: StudentProgressState,
  baseXpAdded: number,
  actionTitle: string
): { nextState: StudentProgressState; toast: AchievementToast } {
  const unlockedSet = new Set(state.unlockedBadgeIds);
  let bonusXp = 0;
  let newlyUnlockedBadgeTitle: string | undefined;

  const completedLessonsCount = Object.values(state.lessons).filter(
    (r) => r.completed
  ).length;
  const totalFingerspellingWords =
    state.fingerspelling.wordsGuessed + state.fingerspelling.wordsSpelled;

  const checkAndAdd = (badgeId: string, condition: boolean) => {
    if (condition && !unlockedSet.has(badgeId)) {
      unlockedSet.add(badgeId);
      const badgeObj = GAMIFICATION_BADGES.find((b) => b.id === badgeId);
      if (badgeObj) {
        bonusXp += badgeObj.xpReward;
        newlyUnlockedBadgeTitle = badgeObj.title;
      }
    }
  };

  checkAndAdd('badge-primer-paso', completedLessonsCount >= 1);
  checkAndAdd('badge-expresion-viva', state.completedFacialChallenges.length >= 1);
  checkAndAdd('badge-dactilologa-inicial', totalFingerspellingWords >= 3);
  checkAndAdd('badge-exploradora-glosario', state.glossaryMasteredIds.length >= 5);
  checkAndAdd('badge-racha-constante', state.currentStreakDays >= 3);
  checkAndAdd(
    'badge-maestra-mnm',
    state.completedFacialChallenges.length >= FACIAL_CHALLENGES.length
  );
  checkAndAdd(
    'badge-experta-deletreo',
    state.fingerspelling.bestStreak >= 5 ||
      state.fingerspelling.adaptiveTier === 'avanzado'
  );
  checkAndAdd(
    'badge-graduada-signaviva',
    completedLessonsCount >= LESSONS_CURRICULUM.length
  );

  const totalXpEarned = baseXpAdded + bonusXp;
  const nextState: StudentProgressState = {
    ...state,
    xpPoints: state.xpPoints + totalXpEarned,
    unlockedBadgeIds: Array.from(unlockedSet)
  };

  saveStudentProgress(nextState);

  const toast: AchievementToast = {
    id: `ach-${Date.now()}`,
    title: newlyUnlockedBadgeTitle
      ? `¡Nueva Insignia Desbloqueada: ${newlyUnlockedBadgeTitle}!`
      : actionTitle,
    message: newlyUnlockedBadgeTitle
      ? `Has recibido una bonificación extra de insignia y sumado +${totalXpEarned} XP a tu perfil.`
      : `¡Excelente trabajo! Has ganado +${totalXpEarned} XP en tu progreso.`,
    xpGained: totalXpEarned,
    badgeUnlocked: newlyUnlockedBadgeTitle
  };

  return { nextState, toast };
}

export function recordLessonCompletion(
  state: StudentProgressState,
  lessonId: string,
  quizScore: number,
  durationMinutes: number
): { nextState: StudentProgressState; toast: AchievementToast } {
  const today = getTodayDateString();
  const existingRecord = state.lessons[lessonId] || {
    lessonId,
    completed: false,
    quizScore: 0,
    facialPracticeScore: 0,
    notes: '',
    bookmarked: false
  };

  const wasAlreadyCompleted = existingRecord.completed;
  const updatedRecord: LessonProgressRecord = {
    ...existingRecord,
    completed: true,
    completedAt: new Date().toISOString(),
    quizScore: Math.max(existingRecord.quizScore, quizScore)
  };

  const todayLog = state.studyLogs[today] || {
    date: today,
    minutesStudied: 0,
    lessonsCompletedCount: 0,
    facialExercisesCount: 0
  };

  const addedMinutes = wasAlreadyCompleted ? 5 : durationMinutes;
  const updatedLog = {
    ...todayLog,
    minutesStudied: todayLog.minutesStudied + addedMinutes,
    lessonsCompletedCount: wasAlreadyCompleted
      ? todayLog.lessonsCompletedCount
      : todayLog.lessonsCompletedCount + 1
  };

  const yesterday = getYesterdayDateString();
  const hadStudyToday = Boolean(state.studyLogs[today]);
  let newStreak = state.currentStreakDays;
  if (!hadStudyToday) {
    newStreak = state.studyLogs[yesterday]
      ? state.currentStreakDays + 1
      : Math.max(1, state.currentStreakDays);
  }

  const intermediateState: StudentProgressState = {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: updatedRecord
    },
    studyLogs: {
      ...state.studyLogs,
      [today]: updatedLog
    },
    currentStreakDays: newStreak,
    longestStreakDays: Math.max(state.longestStreakDays, newStreak),
    totalMinutesStudied: state.totalMinutesStudied + addedMinutes
  };

  const baseXp = wasAlreadyCompleted ? 25 : 60;
  return evaluateAndUnlockBadges(
    intermediateState,
    baseXp,
    '¡Lección Completada!'
  );
}

export function recordFacialChallengeSuccess(
  state: StudentProgressState,
  challengeId: string,
  score: number,
  linkedLessonId?: string
): { nextState: StudentProgressState; toast: AchievementToast } {
  const today = getTodayDateString();
  const completedSet = new Set(state.completedFacialChallenges);
  const wasAlreadyDone = completedSet.has(challengeId);
  completedSet.add(challengeId);

  const todayLog = state.studyLogs[today] || {
    date: today,
    minutesStudied: 0,
    lessonsCompletedCount: 0,
    facialExercisesCount: 0
  };

  const updatedLessons = { ...state.lessons };
  if (linkedLessonId && updatedLessons[linkedLessonId]) {
    updatedLessons[linkedLessonId] = {
      ...updatedLessons[linkedLessonId],
      facialPracticeScore: Math.max(
        updatedLessons[linkedLessonId].facialPracticeScore,
        score
      )
    };
  }

  const intermediateState: StudentProgressState = {
    ...state,
    lessons: updatedLessons,
    completedFacialChallenges: Array.from(completedSet),
    studyLogs: {
      ...state.studyLogs,
      [today]: {
        ...todayLog,
        minutesStudied: todayLog.minutesStudied + 4,
        facialExercisesCount: todayLog.facialExercisesCount + 1
      }
    },
    totalMinutesStudied: state.totalMinutesStudied + 4
  };

  const baseXp = wasAlreadyDone ? 20 : 45;
  return evaluateAndUnlockBadges(
    intermediateState,
    baseXp,
    '¡Reto de Expresión Facial Superado!'
  );
}

export function recordGlossaryTermMastered(
  state: StudentProgressState,
  termId: string,
  termName: string
): { nextState: StudentProgressState; toast: AchievementToast } {
  const masteredSet = new Set(state.glossaryMasteredIds);
  const alreadyMastered = masteredSet.has(termId);
  if (alreadyMastered) {
    masteredSet.delete(termId);
    const nextState: StudentProgressState = {
      ...state,
      glossaryMasteredIds: Array.from(masteredSet)
    };
    saveStudentProgress(nextState);
    return {
      nextState,
      toast: {
        id: `glos-${Date.now()}`,
        title: `Signo "${termName}" marcado para repaso`,
        message: 'Puedes volver a practicarlo cuando quieras en el Glosario.',
        xpGained: 0
      }
    };
  }

  masteredSet.add(termId);
  const intermediateState: StudentProgressState = {
    ...state,
    glossaryMasteredIds: Array.from(masteredSet)
  };

  return evaluateAndUnlockBadges(
    intermediateState,
    25,
    `¡Signo "${termName}" Dominado!`
  );
}

export function recordFingerspellingExercise(
  state: StudentProgressState,
  mode: 'guess_word' | 'spell_word' | 'rapid_letter',
  isCorrect: boolean
): { nextState: StudentProgressState; toast?: AchievementToast } {
  const prevFs = state.fingerspelling;

  if (!isCorrect) {
    const downgradedTier: SkillLevel =
      prevFs.adaptiveTier === 'avanzado'
        ? 'intermedio'
        : prevFs.adaptiveTier === 'intermedio'
        ? 'inicial'
        : 'inicial';

    const nextState: StudentProgressState = {
      ...state,
      fingerspelling: {
        ...prevFs,
        currentStreak: 0,
        adaptiveTier: downgradedTier
      }
    };
    saveStudentProgress(nextState);
    return { nextState };
  }

  const nextStreak = prevFs.currentStreak + 1;
  const nextBestStreak = Math.max(prevFs.bestStreak, nextStreak);

  // Adaptive promotion: 3 consecutive successes promote difficulty level automatically
  let nextTier: SkillLevel = prevFs.adaptiveTier;
  if (nextStreak >= 3 && prevFs.adaptiveTier === 'inicial') {
    nextTier = 'intermedio';
  } else if (nextStreak >= 5 && prevFs.adaptiveTier === 'intermedio') {
    nextTier = 'avanzado';
  }

  const intermediateState: StudentProgressState = {
    ...state,
    totalMinutesStudied: state.totalMinutesStudied + 2,
    fingerspelling: {
      wordsGuessed:
        mode === 'guess_word' ? prevFs.wordsGuessed + 1 : prevFs.wordsGuessed,
      wordsSpelled:
        mode === 'spell_word' ? prevFs.wordsSpelled + 1 : prevFs.wordsSpelled,
      lettersRapidMatched:
        mode === 'rapid_letter'
          ? prevFs.lettersRapidMatched + 1
          : prevFs.lettersRapidMatched,
      currentStreak: nextStreak,
      bestStreak: nextBestStreak,
      adaptiveTier: nextTier
    }
  };

  const xpAmount = mode === 'rapid_letter' ? 15 : 35;
  const label =
    mode === 'guess_word'
      ? '¡Palabra Dactilológica Adivinada!'
      : mode === 'spell_word'
      ? '¡Deletreo Manual Completado!'
      : '¡Configuración Manual Identificada!';

  return evaluateAndUnlockBadges(intermediateState, xpAmount, label);
}

export function saveLessonNote(
  state: StudentProgressState,
  lessonId: string,
  notes: string,
  bookmarked?: boolean
): StudentProgressState {
  const existing = state.lessons[lessonId] || {
    lessonId,
    completed: false,
    quizScore: 0,
    facialPracticeScore: 0,
    notes: '',
    bookmarked: false
  };

  const nextState: StudentProgressState = {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...existing,
        notes,
        bookmarked: bookmarked !== undefined ? bookmarked : existing.bookmarked
      }
    }
  };
  saveStudentProgress(nextState);
  return nextState;
}
