export type SkillLevel = 'inicial' | 'intermedio' | 'avanzado';

export type FacialExpressionType =
  | 'neutral_atento'
  | 'cejas_elevadas_pregunta'
  | 'cejas_fruncidas_wh'
  | 'sonrisa_afectiva'
  | 'apertura_sorpresa'
  | 'enfasis_labial';

export interface SignAnimationKeyframe {
  phaseLabel: string;
  durationMs: number;
  leftHand: {
    x: number; // 0 to 1 normalized canvas width
    y: number; // 0 to 1 normalized canvas height
    rotation: number; // degrees
    fingerSpread: number; // 0 (fist) to 1 (open palm)
    shapeLabel: string;
  };
  rightHand: {
    x: number;
    y: number;
    rotation: number;
    fingerSpread: number;
    shapeLabel: string;
  };
  eyebrowArch: number; // -1 (furrowed) to +1 (raised)
  mouthOpen: number; // 0 to 1
  mouthSmile: number; // -1 to +1
  headTilt: number; // -15 to +15 degrees
  motionArrow?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    type: 'linear' | 'arc' | 'circular';
  };
}

export interface SignVocabularyItem {
  id: string;
  word: string;
  phoneticVisual: string;
  handshape: string;
  location: string;
  movement: string;
  nonManualMarker: string;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  level: SkillLevel;
  durationMinutes: number;
  category: string;
  summary: string;
  learningObjectives: string[];
  biomechanics: {
    configuracionManual: string;
    ubicacionEspacial: string;
    trayectoriaMovimiento: string;
    marcadorFacial: string;
  };
  targetFacialExpression: FacialExpressionType;
  facialExercisePrompt: string;
  vocabulary: SignVocabularyItem[];
  keyframes: SignAnimationKeyframe[];
  quiz: LessonQuizQuestion[];
  offlineTips: string[];
}

export interface FacialChallenge {
  id: string;
  title: string;
  level: SkillLevel;
  grammarFunction: string;
  targetExpression: FacialExpressionType;
  instruction: string;
  linguisticContext: string;
  thresholds: {
    minEyebrowArch?: number;
    maxEyebrowArch?: number;
    minMouthSmile?: number;
    minMouthOpen?: number;
    minHeadTiltAbs?: number;
  };
  holdSecondsRequired: number;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  dailyGoalMinutes: number;
  preferredLevel: SkillLevel;
  avatarInitials: string;
}

export interface LessonProgressRecord {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  quizScore: number; // 0 to 100
  facialPracticeScore: number; // 0 to 100
  notes: string;
  bookmarked: boolean;
}

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  lessonsCompletedCount: number;
  facialExercisesCount: number;
}

export interface ReminderSettings {
  enabled: boolean;
  timeOfDay: string; // "19:00"
  daysOfWeek: number[]; // 0 (Sun) - 6 (Sat)
  customMotivationMessage: string;
  browserPermissionGranted: boolean;
  lastTriggeredDate?: string;
}

export interface StudentProgressState {
  userId: string;
  lessons: Record<string, LessonProgressRecord>;
  completedFacialChallenges: string[];
  studyLogs: Record<string, DailyStudyLog>;
  currentStreakDays: number;
  longestStreakDays: number;
  totalMinutesStudied: number;
  DownloadedGuideIds: string[];
  reminder: ReminderSettings;
}
