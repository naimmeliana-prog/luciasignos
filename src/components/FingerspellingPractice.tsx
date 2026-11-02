import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Delete
} from 'lucide-react';
import {
  DACTYLOLOGY_ALPHABET,
  FINGERSPELLING_WORDS
} from '../data/glossaryAndDactylology';
import { CNSE_BANCOLSE_ITEMS } from '../data/cnseBank';
import {
  DactylologyLetter,
  FingerspellingWordItem,
  SkillLevel,
  StudentProgressState
} from '../types/learning';

interface FingerspellingPracticeProps {
  progress: StudentProgressState;
  onExerciseResult: (
    mode: 'guess_word' | 'spell_word' | 'rapid_letter',
    isCorrect: boolean
  ) => void;
}

type GameMode = 'guess_word' | 'spell_word' | 'rapid_letter' | 'alphabet_table' | 'duel_mode' | 'step_tutorial' | 'fesopras_chart';

const AnatomicalHandGraphic: React.FC<{ letter: string; fingers: DactylologyLetter['fingers']; size?: 'normal' | 'large' }> = ({ letter, size = 'normal' }) => {
  const isLarge = size === 'large';
  const l = letter.toUpperCase();

  return (
    <div className={`relative flex flex-col ${isLarge ? 'w-full h-96' : 'w-full h-64'} rounded-2xl bg-[#0b3166] border-2 border-sky-600 shadow-2xl overflow-hidden p-4 text-white`}>
      {/* Header with Letter and Title */}
      <div className="flex items-center justify-between border-b border-sky-800/60 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-white text-[#0b3166] font-mono font-extrabold text-xl flex items-center justify-center shadow-lg">
            {l}
          </span>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-sky-300 uppercase">Alfabeto Dactilológico Español</div>
            <h4 className="text-sm font-bold text-white">Letra {l} - FESOPRAS</h4>
          </div>
        </div>
        <div className="bg-sky-950/80 text-sky-200 px-2.5 py-1 rounded-lg text-[10px] font-mono border border-sky-800">
          FESOPRAS 2026
        </div>
      </div>

      {/* Central Illustration Area with Distinct 3D Handshape */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#061d3d] rounded-xl border border-sky-900/80 p-4 shadow-inner overflow-hidden">
        <svg className={`w-full ${isLarge ? 'h-48' : 'h-32'}`} viewBox="0 0 160 160" fill="none">
          <g transform="translate(80, 80)">
            {l === 'A' && (
              /* Fist with lateral thumb */
              <g>
                <path d="M -22 20 C -32 0 -30 -24 -10 -30 C 10 -30 26 -12 24 20 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M -26 -4 C -34 -8 -36 10 -24 14 C -20 16 -16 10 -18 2 Z" fill="#f39c12" stroke="#d68910" strokeWidth="2" />
                <path d="M -14 20 L 14 20 L 18 46 L -18 46 Z" fill="#e67e22" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {l === 'B' && (
              /* 4 fingers upright */
              <g>
                <rect x="-16" y="10" width="32" height="24" rx="6" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -12 10 L -12 -34 C -12 -40 -7 -40 -7 -34 L -7 10 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -4 10 L -4 -38 C -4 -44 1 -44 1 -38 L 1 10 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 4 10 L 4 -36 C 4 -42 9 -42 9 -36 L 9 10 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 12 10 L 12 -28 C 12 -34 17 -34 17 -28 L 17 10 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -14 34 L 14 34 L 18 52 L -18 52 Z" fill="#e67e22" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {(l === 'C' || l === 'CH') && (
              /* Curved C shape */
              <g>
                <path d="M 10 -35 C -20 -35 -35 -10 -35 15 C -35 30 -20 42 10 42 C 22 42 26 35 22 30 C -2 30 -18 20 -18 10 C -18 -5 -2 -22 14 -22 C 20 -22 24 -28 10 -35 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M 14 38 L 28 50" fill="none" stroke="#e67e22" strokeWidth="6" strokeLinecap="round" />
              </g>
            )}
            {l === 'D' && (
              /* Index vertical, others in circle */
              <g>
                <path d="M 2 -12 L 2 -48 C 2 -55 8 -55 8 -48 L 8 -12 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <circle cx="-6" cy="12" r="14" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -14 24 L 14 24 L 18 50 L -18 50 Z" fill="#e67e22" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {l === 'E' && (
              /* 5 fingers clawed */
              <g>
                <circle cx="0" cy="10" r="22" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M -22 -4 C -28 -12 -18 -22 -10 -16" fill="none" stroke="#d68910" strokeWidth="3" strokeLinecap="round" />
                <path d="M -12 -12 C -18 -24 -2 -28 2 -16" fill="none" stroke="#d68910" strokeWidth="3" strokeLinecap="round" />
                <path d="M 2 -14 C 4 -28 18 -24 16 -12" fill="none" stroke="#d68910" strokeWidth="3" strokeLinecap="round" />
                <path d="M 14 -8 C 24 -16 26 0 16 6" fill="none" stroke="#d68910" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}
            {l === 'F' && (
              /* Thumb-index circle, 3 fingers up */
              <g>
                <circle cx="-6" cy="10" r="10" fill="none" stroke="#d68910" strokeWidth="3" />
                <path d="M 4 8 L 4 -32 C 4 -38 9 -38 9 -32 L 9 8 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 12 10 L 12 -28 C 12 -34 17 -34 17 -28 L 17 10 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 20 12 L 20 -22 C 20 -28 25 -28 25 -22 L 25 12 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {(l === 'G' || l === 'Q') && (
              /* Horizontal thumb & index */
              <g>
                <path d="M -30 2 L 30 2 C 38 2 38 12 30 12 L -30 12 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -24 -12 L 20 -12 C 26 -12 26 -4 20 -4 L -24 -4 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {l === 'H' && (
              /* Index and middle horizontal */
              <g>
                <path d="M -35 -4 L 25 -4 C 32 -4 32 4 25 4 L -35 4 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M -35 10 L 25 10 C 32 10 32 18 25 18 L -35 18 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {l === 'I' && (
              /* Pinky up */
              <g>
                <rect x="-14" y="14" width="28" height="22" rx="6" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 12 14 L 12 -28 C 12 -35 18 -35 18 -28 L 18 14 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {l === 'J' && (
              /* Pinky curving J */
              <g>
                <rect x="-14" y="14" width="28" height="22" rx="6" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 12 14 L 12 -20 C 12 -30 22 -30 22 -20 L 22 24 C 22 36 6 36 2 28" fill="none" stroke="#d68910" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}
            {l === 'K' && (
              /* Index vertical, middle angled */
              <g>
                <path d="M -6 -10 L -12 -46 C -14 -52 -8 -54 -4 -48 L 4 -12 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 6 -4 L 22 -38 C 25 -44 32 -40 28 -34 L 14 2 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {(l === 'L' || l === 'LL') && (
              /* L shape */
              <g>
                <path d="M -4 20 L -4 -45 C -4 -52 2 -52 2 -45 L 2 20 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2.2" />
                <path d="M -30 14 L 24 14 C 32 14 32 22 24 22 L -30 22 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2.2" />
              </g>
            )}
            {l === 'M' && (
              /* 3 fingers over thumb */
              <g>
                <rect x="-20" y="-8" width="40" height="32" rx="10" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M -16 -8 L -16 -24" stroke="#b9770e" strokeWidth="3" strokeLinecap="round" />
                <path d="M 0 -8 L 0 -28" stroke="#b9770e" strokeWidth="3" strokeLinecap="round" />
                <path d="M 16 -8 L 16 -22" stroke="#b9770e" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}
            {(l === 'N' || l === 'Ñ') && (
              /* 2 fingers over thumb */
              <g>
                <rect x="-18" y="-6" width="36" height="32" rx="10" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M -10 -6 L -10 -26" stroke="#b9770e" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 10 -6 L 10 -26" stroke="#b9770e" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            )}
            {(l === 'O' || l === 'S') && (
              /* Circular O / S */
              <g>
                <circle cx="0" cy="4" r="22" fill="#f5b041" stroke="#d68910" strokeWidth="3" />
                <circle cx="0" cy="4" r="10" fill="#061d3d" />
              </g>
            )}
            {(l === 'P' || l === 'T') && (
              /* P / T configuration */
              <g>
                <rect x="-16" y="-10" width="32" height="36" rx="8" fill="#f5b041" stroke="#d68910" strokeWidth="2.5" />
                <path d="M 0 10 L 0 45" stroke="#d68910" strokeWidth="4" />
              </g>
            )}
            {(l === 'R' || l === 'RR') && (
              /* Crossed fingers R */
              <g>
                <path d="M -6 -30 L 8 20" stroke="#f5b041" strokeWidth="8" strokeLinecap="round" />
                <path d="M 6 -30 L -8 20" stroke="#f5b041" strokeWidth="8" strokeLinecap="round" />
              </g>
            )}
            {l === 'U' && (
              /* U index & middle */
              <g>
                <path d="M -8 16 L -8 -30 C -8 -36 -3 -36 -3 -30 L -3 16 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
                <path d="M 3 16 L 3 -30 C 3 -36 8 -36 8 -30 L 8 16 Z" fill="#f5b041" stroke="#d68910" strokeWidth="2" />
              </g>
            )}
            {(l === 'V' || l === 'W') && (
              /* V / W open */
              <g>
                <path d="M -16 -20 L -4 20" stroke="#f5b041" strokeWidth="9" strokeLinecap="round" />
                <path d="M 16 -20 L 4 20" stroke="#f5b041" strokeWidth="9" strokeLinecap="round" />
                {l === 'W' && <path d="M 0 -15 L 0 20" stroke="#f5b041" strokeWidth="9" strokeLinecap="round" />}
              </g>
            )}
            {l === 'X' && (
              /* Hooked index */
              <g>
                <path d="M -15 -20 C 15 -20 20 15 -5 15" fill="none" stroke="#f5b041" strokeWidth="10" strokeLinecap="round" />
              </g>
            )}
            {l === 'Y' && (
              /* Thumb & pinky wide */
              <g>
                <path d="M -35 -25 L 0 5 L 35 -25" fill="none" stroke="#f5b041" strokeWidth="10" strokeLinecap="round" />
              </g>
            )}
            {l === 'Z' && (
              /* Zigzag Z */
              <g>
                <path d="M -25 -20 L 25 -20 L -25 20 L 25 20" fill="none" stroke="#f5b041" strokeWidth="8" strokeLinejoin="round" />
              </g>
            )}
            
            {/* Letter badge overlay */}
            <text x="0" y="65" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="extrabold" fontFamily="monospace">{l}</text>
          </g>
        </svg>

        {/* Motion indicator for dynamic letters */}
        {['CH', 'G', 'H', 'LL', 'Ñ', 'RR', 'V', 'W', 'X', 'Y', 'Z'].includes(l) && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px] font-mono border border-sky-400/30">
            <span>⇄ Movimiento FESOPRAS</span>
          </div>
        )}
      </div>

      {/* Footer attribution matching FESOPRAS */}
      <div className="mt-3 text-[10px] font-mono text-sky-200 text-center bg-sky-950/90 py-1.5 px-3 rounded-xl border border-sky-800 shrink-0 truncate">
        Federación de Personas Sordas del Principado de Asturias (FESOPRAS)
      </div>
    </div>
  );
};

export const FingerspellingPractice: React.FC<FingerspellingPracticeProps> = ({
  progress,
  onExerciseResult
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('fesopras_chart');
  const [adaptiveAuto, setAdaptiveAuto] = useState<boolean>(true);
  const [manualLevel, setManualLevel] = useState<SkillLevel>(
    progress.fingerspelling.adaptiveTier
  );

  const activeLevel: SkillLevel = adaptiveAuto
    ? progress.fingerspelling.adaptiveTier
    : manualLevel;

  const levelWords = useMemo(() => {
    const filtered = FINGERSPELLING_WORDS.filter((w) => w.level === activeLevel);
    return filtered.length > 0 ? filtered : FINGERSPELLING_WORDS;
  }, [activeLevel]);

  const [wordIndex, setWordIndex] = useState<number>(0);
  const currentWordItem: FingerspellingWordItem =
    levelWords[wordIndex % levelWords.length];

  const [guessInput, setGuessInput] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);
  const [isAnimatingWord, setIsAnimatingWord] = useState<boolean>(true);
  const [slowMotion, setSlowMotion] = useState<boolean>(false);

  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [spellFeedback, setSpellFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const [targetRapidLetter, setTargetRapidLetter] = useState<DactylologyLetter>(
    () => DACTYLOLOGY_ALPHABET[0]
  );
  const [rapidFeedback, setRapidFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const [selectedAlphabetItem, setSelectedAlphabetItem] = useState<DactylologyLetter | null>(null);
  const [tutorialIndex, setTutorialIndex] = useState<number>(0);

  // Duel Mode 1v1 state
  const [duelStatus, setDuelStatus] = useState<'setup' | 'playing' | 'gameover'>('setup');
  const [player1Name, setPlayer1Name] = useState<string>('Estudiante 1 (Ana)');
  const [player2Name, setPlayer2Name] = useState<string>('Estudiante 2 (Carlos)');
  const [duelTimeLeft, setDuelTimeLeft] = useState<number>(45);
  const [activeDuelTurn, setActiveDuelTurn] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [duelWordIdx, setDuelWordIdx] = useState<number>(0);
  const [duelAnswerInput, setDuelAnswerInput] = useState<string>('');
  const [duelFeedbackMessage, setDuelFeedbackMessage] = useState<string | null>(null);
  const [duelLeaderboard, setDuelLeaderboard] = useState<Array<{ name: string; score: number; date: string }>>([
    { name: 'Lucía G. (Maestra LSE)', score: 11, date: 'Hoy' },
    { name: 'Mateo R.', score: 8, date: 'Ayer' },
    { name: 'Sofía M.', score: 7, date: 'Hace 2 días' }
  ]);

  useEffect(() => {
    if (gameMode !== 'duel_mode' || duelStatus !== 'playing') return;
    if (duelTimeLeft <= 0) {
      if (activeDuelTurn === 1) {
        setActiveDuelTurn(2);
        setDuelTimeLeft(45);
        setDuelFeedbackMessage(`¡Tiempo agotado para ${player1Name}! Turno de ${player2Name}.`);
      } else {
        setDuelStatus('gameover');
        setDuelLeaderboard((prev) => [
          { name: player1Name, score: player1Score, date: 'Ahora' },
          { name: player2Name, score: player2Score, date: 'Ahora' },
          ...prev
        ]);
      }
      return;
    }
    const timer = setInterval(() => {
      setDuelTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, duelStatus, duelTimeLeft, activeDuelTurn, player1Name, player2Name, player1Score, player2Score]);

  const handleStartDuel = () => {
    setDuelStatus('playing');
    setDuelTimeLeft(45);
    setActiveDuelTurn(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setDuelWordIdx(0);
    setDuelAnswerInput('');
    setDuelFeedbackMessage('¡Comienza el duelo! Deletrea o identifica la palabra lo más rápido posible.');
  };

  const handleCheckDuelAnswer = (submittedWord: string) => {
    const targetWord = FINGERSPELLING_WORDS[duelWordIdx % FINGERSPELLING_WORDS.length].word;
    const cleanSubmitted = submittedWord.trim().toUpperCase();
    if (cleanSubmitted === targetWord) {
      if (activeDuelTurn === 1) {
        setPlayer1Score((s) => s + 1);
      } else {
        setPlayer2Score((s) => s + 1);
      }
      setDuelFeedbackMessage(`¡Correcto! +1 punto para ${activeDuelTurn === 1 ? player1Name : player2Name}.`);
      setDuelWordIdx((idx) => idx + 1);
      setDuelAnswerInput('');
    } else {
      setDuelFeedbackMessage(`Incorrecto. Era "${targetWord}". Siguiente palabra.`);
      setDuelWordIdx((idx) => idx + 1);
      setDuelAnswerInput('');
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const letterDurationMs = useMemo(() => {
    const base =
      activeLevel === 'inicial'
        ? 1350
        : activeLevel === 'intermedio'
        ? 950
        : 680;
    return slowMotion ? Math.round(base * 1.55) : base;
  }, [activeLevel, slowMotion]);

  useEffect(() => {
    setGuessInput('');
    setGuessFeedback(null);
    setSpelledLetters([]);
    setSpellFeedback(null);
    setActiveLetterIdx(0);
    setIsAnimatingWord(true);
  }, [currentWordItem.id, gameMode]);

  useEffect(() => {
    if (gameMode !== 'guess_word' || !isAnimatingWord) return;
    const chars = currentWordItem.word.split('');
    const interval = setInterval(() => {
      setActiveLetterIdx((prev) => (prev + 1) % chars.length);
    }, letterDurationMs);
    return () => clearInterval(interval);
  }, [gameMode, isAnimatingWord, currentWordItem.word, letterDurationMs]);

  const displayedLetterObj: DactylologyLetter = useMemo(() => {
    if (gameMode === 'guess_word') {
      const ch = currentWordItem.word[activeLetterIdx] || 'A';
      return (
        DACTYLOLOGY_ALPHABET.find((d) => d.letter === ch) ||
        DACTYLOLOGY_ALPHABET[0]
      );
    }
    if (gameMode === 'spell_word') {
      const lastTyped =
        spelledLetters.length > 0
          ? spelledLetters[spelledLetters.length - 1]
          : currentWordItem.word[0];
      return (
        DACTYLOLOGY_ALPHABET.find((d) => d.letter === lastTyped) ||
        DACTYLOLOGY_ALPHABET[0]
      );
    }
    return targetRapidLetter;
  }, [
    gameMode,
    currentWordItem.word,
    activeLetterIdx,
    spelledLetters,
    targetRapidLetter
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hideLabel =
      (gameMode === 'guess_word' && !guessFeedback?.correct) ||
      (gameMode === 'rapid_letter' && !rapidFeedback?.correct);

    drawDactylologyHandCanvas(
      ctx,
      canvas.width,
      canvas.height,
      displayedLetterObj,
      hideLabel,
      gameMode === 'guess_word'
        ? `Letra ${activeLetterIdx + 1} de ${currentWordItem.word.length}`
        : gameMode === 'spell_word'
        ? `Configuración seleccionada: ${displayedLetterObj.letter}`
        : 'Identifica esta configuración manual'
    );
  }, [
    displayedLetterObj,
    gameMode,
    guessFeedback,
    rapidFeedback,
    activeLetterIdx,
    currentWordItem.word.length
  ]);

  const wordChoices = useMemo(() => {
    const others = FINGERSPELLING_WORDS.filter(
      (w) => w.word !== currentWordItem.word
    )
      .slice(0, 3)
      .map((w) => w.word);
    return [currentWordItem.word, ...others].sort();
  }, [currentWordItem.word]);

  const rapidLetterChoices = useMemo(() => {
    const pool = DACTYLOLOGY_ALPHABET.filter(
      (d) => d.letter !== targetRapidLetter.letter
    );
    const step = Math.max(1, Math.floor(pool.length / 5));
    const picks = [
      targetRapidLetter.letter,
      pool[0]?.letter || 'A',
      pool[step]?.letter || 'E',
      pool[step * 2]?.letter || 'I',
      pool[step * 3]?.letter || 'O',
      pool[step * 4]?.letter || 'U'
    ];
    return Array.from(new Set(picks)).sort();
  }, [targetRapidLetter]);

  const handleCheckGuessWord = (submittedWord: string) => {
    const clean = submittedWord.trim().toUpperCase();
    if (!clean) return;
    const isCorrect = clean === currentWordItem.word.toUpperCase();
    onExerciseResult('guess_word', isCorrect);
    if (isCorrect) {
      setGuessFeedback({
        correct: true,
        message: `¡Correcto! La secuencia dactilológica deletrea "${currentWordItem.word}". Has ganado +35 XP.`
      });
    } else {
      setGuessFeedback({
        correct: false,
        message: `Casi: has introducido "${clean}". Observa de nuevo las posiciones de los dedos o activa Cámara Lenta.`
      });
    }
  };

  const handleAppendSpelledLetter = (letter: string) => {
    if (spellFeedback?.correct) return;
    if (spelledLetters.length >= currentWordItem.word.length) return;
    const next = [...spelledLetters, letter];
    setSpelledLetters(next);

    if (next.length === currentWordItem.word.length) {
      const attempt = next.join('');
      const isCorrect = attempt === currentWordItem.word;
      onExerciseResult('spell_word', isCorrect);
      if (isCorrect) {
        setSpellFeedback({
          correct: true,
          message: `¡Deletreo impecable! Construiste "${currentWordItem.word}" con todas sus configuraciones manuales (+35 XP).`
        });
      } else {
        setSpellFeedback({
          correct: false,
          message: `Secuencia incorrecta (${attempt}). Pulsa "Borrar" para corregir las letras que no coinciden.`
        });
      }
    }
  };

  const handlePickRapidLetter = (letter: string) => {
    const isCorrect = letter === targetRapidLetter.letter;
    onExerciseResult('rapid_letter', isCorrect);
    if (isCorrect) {
      setRapidFeedback({
        correct: true,
        message: `¡Exacto! Configuración de la letra ${targetRapidLetter.letter}: ${targetRapidLetter.handshapeSummary} (+15 XP).`
      });
    } else {
      setRapidFeedback({
        correct: false,
        message: `Esa no es la ${letter}. Fíjate en la posición del pulgar y los dedos extendidos.`
      });
    }
  };

  const handleNextChallenge = () => {
    if (gameMode === 'rapid_letter') {
      const currentIdx = DACTYLOLOGY_ALPHABET.findIndex(
        (d) => d.letter === targetRapidLetter.letter
      );
      const nextIdx = (currentIdx + 3) % DACTYLOLOGY_ALPHABET.length;
      setTargetRapidLetter(DACTYLOLOGY_ALPHABET[nextIdx]);
      setRapidFeedback(null);
    } else {
      setWordIndex((prev) => prev + 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono text-sky-700 mb-1">
            ENTRENAMIENTO DACTILOLÓGICO ADAPTATIVO · A–Z
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Ejercicios Interactivos de Deletreo Manual
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Practica la lectura visual y la articulación letra por letra. El sistema adapta automáticamente la velocidad y longitud de las palabras según tu racha de aciertos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shrink-0">
          <div className="text-xs">
            <div className="text-slate-500">Nivel Adaptativo Activo</div>
            <div className="font-bold text-slate-900 capitalize font-mono">
              Nivel {activeLevel} · Racha: {progress.fingerspelling.currentStreak}
            </div>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAdaptiveAuto(true)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                adaptiveAuto
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auto-Adaptativo
            </button>
            {(['inicial', 'intermedio', 'avanzado'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setAdaptiveAuto(false);
                  setManualLevel(lvl);
                }}
                className={`px-2.5 py-1 text-xs font-medium capitalize rounded-md transition-colors cursor-pointer ${
                  !adaptiveAuto && manualLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {(
          [
            {
              id: 'guess_word',
              title: '1. Adivina la Palabra',
              desc: 'Observa la mano anatómica deletreando en tiempo real y descubre qué palabra es.'
            },
            {
              id: 'spell_word',
              title: '2. Deletrea la Palabra',
              desc: 'Construye la palabra objetivo seleccionando las configuraciones manuales letra por letra.'
            },
            {
              id: 'rapid_letter',
              title: '3. Reto Rápido de Letras',
              desc: 'Identifica al instante el queirema dactilológico en pantalla para ganar puntos de agilidad.'
            },
            {
              id: 'alphabet_table',
              title: '4. Tabla Completa A–Z',
              desc: 'Consulta la tabla oficial con las 27 configuraciones manuales del alfabeto.'
            },
            {
              id: 'duel_mode',
              title: '5. Modo Duelo 1v1',
              desc: 'Competencia en tiempo real entre dos estudiantes con cronómetro y ranking en vivo.'
            },
            {
              id: 'step_tutorial',
              title: '6. Tutorial Paso a Paso',
              desc: 'Tarjetas flash guiadas para aprender la posición exacta de los dedos letra por letra.'
            },
            {
              id: 'fesopras_chart',
              title: '7. Infografía FESOPRAS',
              desc: 'Visualiza la infografía original exacta del Alfabeto Dactilológico Español de FESOPRAS.'
            }
          ] as const
        ).map((m) => {
          const isCurrent = gameMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setGameMode(m.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white border-sky-600 ring-1 ring-sky-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold text-slate-900">{m.title}</div>
              <p className="text-xs text-slate-600 mt-1">{m.desc}</p>
            </button>
          );
        })}
      </div>

      <>
        {gameMode === 'fesopras_chart' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="text-xs font-mono text-sky-700 mb-1">
                  INFOGRAFÍA OFICIAL · FESOPRAS
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                  Alfabeto Dactilológico Español - FESOPRAS
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Federación de Personas Sordas del Principado de Asturias (FESOPRAS). Infografía oficial integrada directamente en la aplicación.
                </p>
              </div>
            </div>
            <div className="bg-[#0b3166] rounded-2xl p-4 border border-sky-600 flex flex-col items-center justify-center shadow-2xl">
              <img
                src="/assets/aistudio/descarga_5f1b9159.jfif"
                alt="Alfabeto Dactilológico Español FESOPRAS"
                className="w-full max-h-[85vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        )}

        {gameMode === 'alphabet_table' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b3166] text-white p-6 rounded-2xl shadow-md">
            <div>
              <div className="text-xs font-mono text-sky-300">INFOGRAFÍA OFICIAL DE REFERENCIA</div>
              <h2 className="text-xl font-bold mt-1">Alfabeto Dactilológico Español (FESOPRAS)</h2>
              <p className="text-xs text-sky-100 mt-1">
                Basado en la infografía oficial de la Federación de Personas Sordas del Principado de Asturias.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGameMode('fesopras_chart')}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-transform hover:scale-105 shrink-0"
            >
              Ver Infografía Completa a Pantalla Completa 🔍
            </button>
          </div>

          <div>
            <div className="text-xs font-mono text-sky-700">
              REFERENCIA OFICIAL LSE · ABECEDARIO DACTILOLÓGICO COMPLETO A–Z
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Tabla Completa del Alfabeto Dactilológico
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Consulta la configuración manual, posición del pulgar y pautas de articulación de cada letra del abecedario dactilológico en Lengua de Signos Española.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DACTYLOLOGY_ALPHABET.map((item) => (
              <div
                key={item.letter}
                onClick={() => setSelectedAlphabetItem(item)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <AnatomicalHandGraphic letter={item.letter} fingers={item.fingers} />

                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-lg bg-sky-700 text-white font-mono font-bold flex items-center justify-center text-base shadow-xs">
                      {item.letter}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {item.handshapeSummary}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  <strong>Tip de ejecución:</strong> {item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameMode === 'duel_mode' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="text-xs font-mono text-sky-700 mb-1">
                COMPETENCIA EN TIEMPO REAL · MODALIDAD 1V1
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                Modo Duelo de Deletreo LSE
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Dos estudiantes compiten en rondas de 45 segundos para descifrar y deletrear el mayor número de palabras posibles. ¡Incluye ranking en vivo!
              </p>
            </div>

            {duelStatus === 'playing' && (
              <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl border border-slate-800 shadow-md">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400">CRONÓMETRO</div>
                  <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">{duelTimeLeft}s</div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400">TURNO ACTIVO</div>
                  <div className="text-sm font-bold text-sky-300">
                    {activeDuelTurn === 1 ? player1Name : player2Name}
                  </div>
                </div>
              </div>
            )}
          </div>

          {duelStatus === 'setup' && (
            <div className="max-w-2xl mx-auto space-y-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Nombre del Jugador 1</label>
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-2 focus:outline-sky-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Nombre del Jugador 2</label>
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-2 focus:outline-sky-600"
                  />
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 space-y-2 text-xs text-sky-950">
                <div className="font-bold flex items-center gap-1.5 text-sky-900 text-sm">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>Reglas del Duelo 1v1</span>
                </div>
                <p>
                  Cada estudiante dispone de 45 segundos por turno para identificar o deletrear correctamente las palabras presentadas en pantalla. El sistema lleva el registro de puntos y actualiza la tabla de clasificación en vivo.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleStartDuel}
                  className="px-8 py-3.5 bg-sky-700 text-white rounded-xl text-sm font-semibold hover:bg-sky-800 shadow-md cursor-pointer transition-transform hover:scale-105"
                >
                  ¡Comenzar Duelo en Tiempo Real!
                </button>
              </div>
            </div>
          )}

          {duelStatus === 'playing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono text-sky-400">TURNO DE {activeDuelTurn === 1 ? player1Name.toUpperCase() : player2Name.toUpperCase()}</div>
                    <h3 className="text-xl font-bold mt-0.5">Deletrea la palabra objetivo</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono">Puntuación Actual</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      {activeDuelTurn === 1 ? player1Score : player2Score} pts
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-4">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Palabra Objetivo LSE</div>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-widest text-sky-300">
                    {FINGERSPELLING_WORDS[duelWordIdx % FINGERSPELLING_WORDS.length].word}
                  </div>
                  <p className="text-xs text-slate-400">
                    <strong>Pista:</strong> {FINGERSPELLING_WORDS[duelWordIdx % FINGERSPELLING_WORDS.length].clue}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (duelAnswerInput) handleCheckDuelAnswer(duelAnswerInput);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={duelAnswerInput}
                      onChange={(e) => setDuelAnswerInput(e.target.value.toUpperCase())}
                      placeholder="Escribe la palabra en mayúsculas..."
                      className="flex-1 px-4 py-3 text-sm font-mono uppercase bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-2 focus:outline-sky-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-500 cursor-pointer"
                    >
                      Enviar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {[
                      FINGERSPELLING_WORDS[(duelWordIdx) % FINGERSPELLING_WORDS.length].word,
                      FINGERSPELLING_WORDS[(duelWordIdx + 1) % FINGERSPELLING_WORDS.length].word,
                      FINGERSPELLING_WORDS[(duelWordIdx + 2) % FINGERSPELLING_WORDS.length].word,
                      FINGERSPELLING_WORDS[(duelWordIdx + 3) % FINGERSPELLING_WORDS.length].word
                    ].sort().map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleCheckDuelAnswer(opt)}
                        className="py-3 px-4 text-sm font-mono font-bold rounded-xl border border-slate-700 bg-slate-950 hover:bg-sky-950 hover:border-sky-500 text-white transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </form>

                {duelFeedbackMessage && (
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-medium">
                    {duelFeedbackMessage}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-900">Marcador en Vivo del Duelo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <div className="text-xs font-mono text-slate-500">Jugador 1</div>
                      <div className="text-sm font-bold text-slate-900">{player1Name}</div>
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-sky-700">{player1Score} pts</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <div className="text-xs font-mono text-slate-500">Jugador 2</div>
                      <div className="text-sm font-bold text-slate-900">{player2Name}</div>
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-indigo-700">{player2Score} pts</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeDuelTurn === 1) {
                        setActiveDuelTurn(2);
                        setDuelTimeLeft(45);
                        setDuelFeedbackMessage(`Turno cambiado a ${player2Name}.`);
                      } else {
                        setDuelStatus('gameover');
                      }
                    }}
                    className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {activeDuelTurn === 1 ? `Finalizar Turno de ${player1Name} y Pasar a Jugador 2` : 'Finalizar Duelo y Ver Resultados'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {duelStatus === 'gameover' && (
            <div className="max-w-2xl mx-auto space-y-8 py-6 text-center">
              <div className="p-8 bg-sky-50 border border-sky-200 rounded-2xl space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-700 text-white shadow-md mx-auto">
                  <Trophy className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">¡Duelo Finalizado con Éxito!</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {player1Score > player2Score
                      ? `¡Ganador: ${player1Name} con ${player1Score} aciertos!`
                      : player2Score > player1Score
                      ? `¡Ganador: ${player2Name} con ${player2Score} aciertos!`
                      : '¡Empate técnico excelente entre ambos estudiantes!'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">{player1Name}</div>
                    <div className="text-2xl font-mono font-bold text-sky-700">{player1Score} pts</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500">{player2Name}</div>
                    <div className="text-2xl font-mono font-bold text-indigo-700">{player2Score} pts</div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartDuel}
                    className="px-6 py-3 bg-sky-700 text-white rounded-xl text-xs font-semibold hover:bg-sky-800 cursor-pointer"
                  >
                    Jugar Otro Duelo 1v1
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuelStatus('setup')}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cambiar Nombres
                  </button>
                </div>
              </div>

              {/* Live Ranking Table */}
              <div className="space-y-4 text-left">
                <h4 className="text-lg font-bold text-slate-900">Ranking en Vivo del Duelo de Deletreo</h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 border-b border-slate-200">
                    <div className="col-span-2">Posición</div>
                    <div className="col-span-6">Estudiante / Pareja</div>
                    <div className="col-span-4 text-right">Puntuación</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {duelLeaderboard
                      .sort((a, b) => b.score - a.score)
                      .map((entry, idx) => (
                        <div key={`${entry.name}-${idx}`} className="grid grid-cols-12 px-4 py-3 text-xs text-slate-700 items-center">
                          <div className="col-span-2 font-mono font-bold text-sky-700">#{idx + 1}</div>
                          <div className="col-span-6 font-semibold text-slate-900">{entry.name}</div>
                          <div className="col-span-4 text-right font-mono font-bold tabular-nums text-emerald-700">{entry.score} aciertos</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {gameMode === 'step_tutorial' && (() => {
        const currentTutorialItem = DACTYLOLOGY_ALPHABET[tutorialIndex % DACTYLOLOGY_ALPHABET.length];
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="text-xs font-mono text-sky-700 mb-1">
                  TUTORIAL PASO A PASO · TARJETAS FLASH A–Z
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                  Guía Interactiva de Posición de Dedos
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Aprende la postura anatómica paso a paso para cada letra antes de practicar con la cámara.
                </p>
              </div>

              <div className="text-xs font-mono font-bold bg-sky-50 text-sky-800 px-4 py-2 rounded-xl border border-sky-200">
                Letra {tutorialIndex + 1} de {DACTYLOLOGY_ALPHABET.length}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <AnatomicalHandGraphic letter={currentTutorialItem.letter} fingers={currentTutorialItem.fingers} size="large" />
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setTutorialIndex((i) => (i - 1 + DACTYLOLOGY_ALPHABET.length) % DACTYLOLOGY_ALPHABET.length)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    ← Letra Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setTutorialIndex((i) => (i + 1) % DACTYLOLOGY_ALPHABET.length)}
                    className="flex-1 py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Siguiente Letra →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="text-xs font-mono text-sky-700 font-bold uppercase">Letra {currentTutorialItem.letter} · {currentTutorialItem.name}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentTutorialItem.handshapeSummary}</h3>
                </div>

                <div className="space-y-4 text-xs text-slate-700">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-700" />
                      <span>Paso 1: Posición de Antebrazo y Muñeca</span>
                    </div>
                    <p>Sitúa la mano dominante frente al hombro derecho a unos 15 cm del torso con la palma orientada firmemente hacia el interlocutor.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
                    <div className="font-bold text-sky-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-700" />
                      <span>Paso 2: Configuración del Pulgar y Dedos</span>
                    </div>
                    <p>{currentTutorialItem.tip}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Paso 3: Marcador No Manual y Vocalización</span>
                    </div>
                    <p>Articula silenciosamente la letra con los labios mientras mantienes la mirada firme en el receptor sin sacudidas bruscas.</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setGameMode('spell_word')}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Practicar esta Letra con Deletreo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {gameMode !== 'alphabet_table' && gameMode !== 'duel_mode' && gameMode !== 'step_tutorial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="relative aspect-4/3 w-full bg-slate-950">
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-full object-contain block"
                aria-label="Visor anatómico de configuración manual dactilológica"
              />
            </div>

            {gameMode === 'guess_word' && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-center gap-2">
                {currentWordItem.word.split('').map((ch, idx) => {
                  const isActive = idx === activeLetterIdx;
                  const revealed = Boolean(guessFeedback?.correct);
                  return (
                    <button
                      key={`${idx}-${ch}`}
                      type="button"
                      onClick={() => {
                        setIsAnimatingWord(false);
                        setActiveLetterIdx(idx);
                      }}
                      className={`w-10 h-10 rounded-lg font-mono text-sm font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-600 border-sky-400 text-white scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {revealed ? ch : idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAnimatingWord((a) => !a)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isAnimatingWord ? 'Pausar Secuencia' : 'Reanudar Secuencia'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSlowMotion((s) => !s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                    slowMotion
                      ? 'bg-amber-950 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {slowMotion ? 'Velocidad Lenta (0.6x Activa)' : 'Activar Cámara Lenta'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          {gameMode === 'guess_word' && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-mono text-sky-700">
                  MODO 1: RECEPCIÓN VISUAL · {currentWordItem.word.length} LETRAS
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  ¿Qué palabra está deletreando la mano?
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Pista semántica ({currentWordItem.category}):</strong>{' '}
                  {currentWordItem.clue}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckGuessWord(guessInput);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value.toUpperCase())}
                  placeholder="Escribe la palabra aquí..."
                  className="flex-1 px-3.5 py-2.5 text-sm font-mono uppercase border border-slate-300 rounded-lg text-slate-900 focus:outline-2 focus:outline-sky-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Comprobar
                </button>
              </form>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  O selecciona directamente entre estas opciones:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {wordChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => {
                        setGuessInput(choice);
                        handleCheckGuessWord(choice);
                      }}
                      className="py-2.5 px-4 text-sm font-mono font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-400 text-slate-900 transition-colors cursor-pointer"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {guessFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    guessFeedback.correct
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{guessFeedback.message}</span>
                  </div>
                  {guessFeedback.correct && (
                    <button
                      type="button"
                      onClick={handleNextChallenge}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 cursor-pointer"
                    >
                      <span>Siguiente Palabra</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {gameMode === 'spell_word' && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-mono text-sky-700">
                  MODO 2: CONSTRUCCIÓN DACTILOLÓGICA PASO A PASO
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Deletrea la palabra:{' '}
                  <span className="font-mono text-sky-700">{currentWordItem.word}</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Selecciona en orden cada configuración manual en el teclado dactilológico inferior.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  {currentWordItem.word.split('').map((targetChar, idx) => {
                    const userChar = spelledLetters[idx];
                    return (
                      <div
                        key={`${idx}-${targetChar}`}
                        className={`w-10 h-11 rounded-lg flex flex-col items-center justify-center border font-mono text-sm font-bold ${
                          userChar
                            ? 'bg-sky-700 border-sky-700 text-white'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        <span>{userChar || '_'}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSpelledLetters((prev) => prev.slice(0, -1));
                      setSpellFeedback(null);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <Delete className="w-3.5 h-3.5" />
                    <span>Borrar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpelledLetters([]);
                      setSpellFeedback(null);
                    }}
                    className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Reiniciar palabra"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Teclado de Configuraciones Manuales (A–Z):
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-60 overflow-y-auto p-1">
                  {DACTYLOLOGY_ALPHABET.map((item) => (
                    <button
                      key={item.letter}
                      type="button"
                      onClick={() => handleAppendSpelledLetter(item.letter)}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-500 text-center transition-colors cursor-pointer"
                      title={item.handshapeSummary}
                    >
                      <div className="text-sm font-mono font-bold text-slate-900">
                        {item.letter}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.fingers.index > 0.7 ? 'Abierta' : 'Cerrada'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {spellFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    spellFeedback.correct
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="font-semibold">{spellFeedback.message}</div>
                  {spellFeedback.correct && (
                    <button
                      type="button"
                      onClick={handleNextChallenge}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 cursor-pointer"
                    >
                      <span>Siguiente Palabra</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {gameMode === 'rapid_letter' && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-mono text-sky-700">
                  MODO 3: AGILIDAD DE LECTURA DE QUEIREMAS
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  ¿Qué letra representa esta configuración manual?
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Pista biomecánica:</strong> {targetRapidLetter.tip}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {rapidLetterChoices.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handlePickRapidLetter(letter)}
                    className="py-3.5 px-4 text-lg font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-500 text-slate-900 transition-colors cursor-pointer"
                  >
                    Letra {letter}
                  </button>
                ))}
              </div>

              {rapidFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    rapidFeedback.correct
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="font-semibold">{rapidFeedback.message}</div>
                  {rapidFeedback.correct && (
                    <button
                      type="button"
                      onClick={handleNextChallenge}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 cursor-pointer"
                    >
                      <span>Siguiente Letra</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Guía de articulación actual:</strong>{' '}
              {displayedLetterObj.handshapeSummary}
            </div>
          </div>
        </div>
      </div>
      )}
      </>

      {selectedAlphabetItem && (() => {
        const cnseInfo = CNSE_BANCOLSE_ITEMS.find(c => c.letter === selectedAlphabetItem.letter) || CNSE_BANCOLSE_ITEMS[0];
        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-2xl max-w-3xl w-full mx-auto max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-auto">
              {/* Header with top-right X close button */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-mono font-bold text-2xl flex items-center justify-center shadow-md">
                    {selectedAlphabetItem.letter}
                  </span>
                  <div>
                    <div className="text-xs font-mono text-emerald-800 font-bold">BANCO DE IMÁGENES Y SIGNOS LSE - FUNDACIÓN CNSE</div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedAlphabetItem.name}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAlphabetItem(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer shrink-0 transition-colors shadow-xs"
                  title="Cerrar ventana"
                >
                  ✕
                </button>
              </div>

              {/* Central scrollable area for letter reference from LSE bank */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnatomicalHandGraphic letter={selectedAlphabetItem.letter} fingers={selectedAlphabetItem.fingers} size="large" />

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Configuración Manual Oficial (Fundación CNSE):</div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-950">
                    {cnseInfo.handshapeSummary}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Pautas Biomecánicas y Tip de Ejecución:</div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed">
                    {cnseInfo.tip}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Marcador No Manual (MNM) y Expresión:</div>
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed">
                    {cnseInfo.nonManualMarker}
                  </div>
                </div>

                {/* CC BY-NC-SA license informative text in the footer of card */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 leading-relaxed">
                  <strong>Atribución legal (CC BY-NC-SA 3.0):</strong> {cnseInfo.attribution}. Las acciones, productos y utilidades derivadas de su utilización no podrán generar ningún tipo de lucro.
                </div>
              </div>

              {/* Fixed Entendido, Cerrar button at the bottom */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedAlphabetItem(null)}
                  className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-sm font-bold cursor-pointer shadow-md transition-all hover:scale-105"
                >
                  Entendido, Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
    </section>
  );
};

function drawDactylologyHandCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  letterObj: DactylologyLetter,
  hideLetterBadge: boolean,
  subtitleText: string
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Studio Spotlight Backdrop
  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.52,
    30,
    width * 0.5,
    height * 0.52,
    width * 0.65
  );
  bg.addColorStop(0, '#1e293b');
  bg.addColorStop(0.7, '#0f172a');
  bg.addColorStop(1, '#080d1a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height * 0.56;

  // Ambient focus rings
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 18, 136, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
  ctx.beginPath();
  ctx.arc(cx, cy - 18, 168, 0, Math.PI * 2);
  ctx.stroke();

  // Draw High-Detail Anatomical Hand Model
  ctx.save();
  ctx.translate(cx, cy + 32);
  ctx.rotate((letterObj.fingers.rotationDeg * Math.PI) / 180);

  const skinGrad = ctx.createLinearGradient(-56, -130, 56, 80);
  skinGrad.addColorStop(0, '#fde4cf');
  skinGrad.addColorStop(0.55, '#f3c19d');
  skinGrad.addColorStop(1, '#d99b72');

  const foldedGrad = ctx.createLinearGradient(0, -60, 0, 10);
  foldedGrad.addColorStop(0, '#eec09c');
  foldedGrad.addColorStop(1, '#c88a62');

  // Forearm & Tailored Sleeve Cuff
  ctx.fillStyle = '#e5af88';
  ctx.beginPath();
  ctx.moveTo(-32, 34);
  ctx.lineTo(32, 34);
  ctx.lineTo(38, 86);
  ctx.lineTo(-38, 86);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#0f365c';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-44, 62, 88, 70, 10);
  ctx.fill();
  ctx.stroke();

  // Sculpted Anatomical Palm Contour (Metacarpal base + Thenar & Hypothenar eminence)
  ctx.fillStyle = skinGrad;
  ctx.strokeStyle = '#8c583a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-36, 38);
  ctx.bezierCurveTo(-56, 22, -58, -14, -50, -44);
  ctx.quadraticCurveTo(0, -52, 50, -44);
  ctx.bezierCurveTo(56, -14, 52, 22, 36, 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Natural Palm Creases (Heart line, Head line, Thenar line)
  ctx.strokeStyle = 'rgba(140, 88, 58, 0.32)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Heart line
  ctx.moveTo(-40, -18);
  ctx.quadraticCurveTo(4, -14, 42, -24);
  // Head line
  ctx.moveTo(-42, -4);
  ctx.quadraticCurveTo(-4, -2, 28, 8);
  // Thenar (life) line
  ctx.moveTo(-26, -10);
  ctx.quadraticCurveTo(-8, 10, -14, 30);
  ctx.stroke();

  // 4 Articulated Fingers (Index, Middle, Ring, Pinky)
  const fingerRatios = [
    letterObj.fingers.index,
    letterObj.fingers.middle,
    letterObj.fingers.ring,
    letterObj.fingers.pinky
  ];
  const baseOffsets = [-35, -12, 12, 35];
  const maxLengths = [92, 104, 96, 78];
  const fingerWidths = [20, 21, 20, 17];

  fingerRatios.forEach((ratio, idx) => {
    const xBase = baseOffsets[idx];
    const w = fingerWidths[idx];
    const spreadRad = (idx - 1.5) * letterObj.fingers.spreadAngle * 0.25;

    ctx.save();
    ctx.translate(xBase, -42);
    ctx.rotate(spreadRad);

    if (ratio >= 0.45) {
      // Extended Multi-Phalange Tapered Finger
      const len = 34 + ratio * maxLengths[idx];
      ctx.fillStyle = skinGrad;
      ctx.strokeStyle = '#8c583a';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(-w / 2, 4);
      ctx.lineTo(-w * 0.44, -len + 12);
      ctx.quadraticCurveTo(0, -len - 4, w * 0.44, -len + 12);
      ctx.lineTo(w / 2, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Proximal & Distal Interphalangeal Joint Creases
      ctx.strokeStyle = 'rgba(140, 88, 58, 0.38)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-w * 0.34, -len * 0.36);
      ctx.lineTo(w * 0.34, -len * 0.36);
      ctx.moveTo(-w * 0.30, -len * 0.68);
      ctx.lineTo(w * 0.30, -len * 0.68);
      ctx.stroke();

      // Anatomical Fingernail / Fingerpad highlight
      ctx.fillStyle = 'rgba(255, 245, 238, 0.65)';
      ctx.beginPath();
      ctx.roundRect(-w * 0.28, -len + 4, w * 0.56, 11, 5);
      ctx.fill();
    } else {
      // Curled / Flexed Finger folding naturally into the palm
      const curlDepth = 26 + (1 - ratio) * 18;
      ctx.fillStyle = foldedGrad;
      ctx.strokeStyle = '#7c4d32';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -14, w, curlDepth, 9);
      ctx.fill();
      ctx.stroke();

      // Knuckle crease & curled fingernail
      ctx.strokeStyle = 'rgba(124, 77, 50, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-w * 0.35, 2);
      ctx.lineTo(w * 0.35, 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 245, 238, 0.55)';
      ctx.beginPath();
      ctx.roundRect(-w * 0.28, curlDepth - 24, w * 0.56, 7, 3);
      ctx.fill();
    }

    ctx.restore();
  });

  // Sculpted Thumb with Thenar Muscle Base
  ctx.save();
  const thumbRatio = letterObj.fingers.thumb;
  if (thumbRatio >= 0.5) {
    // Extended lateral thumb (e.g. A, L, Y, G, C)
    const thumbAngle = -0.35 - thumbRatio * 0.58;
    ctx.translate(-46, -2);
    ctx.rotate(thumbAngle);
    ctx.fillStyle = skinGrad;
    ctx.strokeStyle = '#8c583a';
    ctx.lineWidth = 2.2;
    const thumbLen = 38 + thumbRatio * 40;
    ctx.beginPath();
    ctx.roundRect(-11, -thumbLen, 22, thumbLen, 11);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 245, 238, 0.65)';
    ctx.beginPath();
    ctx.roundRect(-6.5, -thumbLen + 4, 13, 10, 5);
    ctx.fill();
  } else {
    // Adducted / Folded thumb across the palm (e.g. B, E, I, M, N, S, U, V, W)
    ctx.translate(-36, -6);
    ctx.rotate(0.85);
    ctx.fillStyle = foldedGrad;
    ctx.strokeStyle = '#7c4d32';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-10, -44, 20, 46, 10);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Motion trajectory arrow for dynamic letters (Ñ, J, Z)
  if (letterObj.fingers.motionType && letterObj.fingers.motionType !== 'static') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(-64, -152);
    ctx.quadraticCurveTo(0, -174, 64, -152);
    ctx.stroke();
  }

  ctx.restore();

  // Top HUD Bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(16, 16, width - 32, 44);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 13px "IBM Plex Mono", monospace';
  ctx.fillText(subtitleText, 30, 43);

  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'right';
  ctx.fillText(
    hideLetterBadge ? 'LETRA OCULTA [?]' : `CONFIGURACIÓN: LETRA ${letterObj.letter}`,
    width - 30,
    43
  );

  ctx.restore();
}
