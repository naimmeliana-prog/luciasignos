import { StudentProgressState, LessonProgressRecord } from '../types/learning';
import { LESSONS_CURRICULUM } from '../data/curriculum';

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
      completed: idx === 0, // Pre-complete first lesson on demo account or keep ready
      completedAt: idx === 0 ? new Date().toISOString() : undefined,
      quizScore: idx === 0 ? 100 : 0,
      facialPracticeScore: idx === 0 ? 92 : 0,
      notes: idx === 0 ? 'Recordar proyectar "Gracias" desde el mentón manteniendo sonrisa.' : '',
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
    // Ensure all curriculum lessons exist in record
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
    return parsed;
  } catch {
    return createInitialProgress(userId);
  }
}

export function saveStudentProgress(state: StudentProgressState): void {
  localStorage.setItem(`${PROGRESS_PREFIX}${state.userId}`, JSON.stringify(state));
}

export function recordLessonCompletion(
  state: StudentProgressState,
  lessonId: string,
  quizScore: number,
  durationMinutes: number
): StudentProgressState {
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
    newStreak = state.studyLogs[yesterday] ? state.currentStreakDays + 1 : Math.max(1, state.currentStreakDays);
  }

  const nextState: StudentProgressState = {
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

  saveStudentProgress(nextState);
  return nextState;
}

export function recordFacialChallengeSuccess(
  state: StudentProgressState,
  challengeId: string,
  score: number,
  linkedLessonId?: string
): StudentProgressState {
  const today = getTodayDateString();
  const completedSet = new Set(state.completedFacialChallenges);
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
      facialPracticeScore: Math.max(updatedLessons[linkedLessonId].facialPracticeScore, score)
    };
  }

  const nextState: StudentProgressState = {
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

  saveStudentProgress(nextState);
  return nextState;
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
