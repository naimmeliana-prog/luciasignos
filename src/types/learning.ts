export type SkillLevel = 'inicial' | 'intermedio' | 'avanzado' | 'gva_oficial';

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
    x: number;
    y: number;
    rotation: number;
    fingerSpread: number;
    shapeLabel: string;
  };
  rightHand: {
    x: number;
    y: number;
    rotation: number;
    fingerSpread: number;
    shapeLabel: string;
  };
  eyebrowArch: number;
  mouthOpen: number;
  mouthSmile: number;
  headTilt: number;
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
  realisticPhotoUrl?: string;
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
  realisticPhotoUrl?: string;
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

export type GlossaryCategory =
  | 'Saludos y Cortesía'
  | 'Familia y Personas'
  | 'Vida Cotidiana'
  | 'Preguntas y Gramática'
  | 'Tiempo y Verbos'
  | 'Salud y Emergencias'
  | 'Administración y GVA'
  | 'Educación y Cultura Sorda';

export interface GlossaryEntry {
  id: string;
  term: string;
  category: GlossaryCategory;
  level: SkillLevel;
  description: string;
  handshape: string;
  location: string;
  movement: string;
  nonManualMarker: string;
  exampleSentence: string;
  exampleGloss: string;
  keyframes: SignAnimationKeyframe[];
  realisticPhotoUrl?: string;
}

export interface DactylologyLetter {
  letter: string;
  name: string;
  handshapeSummary: string;
  tip: string;
  fingers: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
    spreadAngle: number;
    rotationDeg: number;
    motionType?: 'static' | 'tilde_wave' | 'double_slide' | 'z_trace';
  };
  realisticPhotoUrl?: string;
}

export interface FingerspellingWordItem {
  id: string;
  word: string;
  clue: string;
  category: string;
  level: SkillLevel;
}

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'lecciones' | 'deletreo' | 'facial' | 'constancia' | 'glosario' | 'gva';
  requirementLabel: string;
}

export interface AchievementToast {
  id: string;
  title: string;
  message: string;
  xpGained: number;
  badgeUnlocked?: string;
}

export interface GvaExamQuestion {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  signGlossReference?: string;
}

export interface LinguisticModule {
  id: string;
  title: string;
  subtitle: string;
  category: 'Fonología' | 'Morfosintaxis' | 'Pragmática' | 'Clasificadores';
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
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
  quizScore: number;
  facialPracticeScore: number;
  notes: string;
  bookmarked: boolean;
}

export interface DailyStudyLog {
  date: string;
  minutesStudied: number;
  lessonsCompletedCount: number;
  facialExercisesCount: number;
}

export interface ReminderSettings {
  enabled: boolean;
  timeOfDay: string;
  daysOfWeek: number[];
  customMotivationMessage: string;
  browserPermissionGranted: boolean;
  lastTriggeredDate?: string;
}

export interface FingerspellingStats {
  wordsGuessed: number;
  wordsSpelled: number;
  lettersRapidMatched: number;
  currentStreak: number;
  bestStreak: number;
  adaptiveTier: SkillLevel;
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
  xpPoints: number;
  unlockedBadgeIds: string[];
  glossaryMasteredIds: string[];
  fingerspelling: FingerspellingStats;
  gvaExamScores: Record<string, number>;
}
