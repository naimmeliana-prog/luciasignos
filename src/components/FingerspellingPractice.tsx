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

type GameMode = 'guess_word' | 'spell_word' | 'rapid_letter';

export const FingerspellingPractice: React.FC<FingerspellingPracticeProps> = ({
  progress,
  onExerciseResult
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('guess_word');
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

  // Mode 1 (Guess Word) state
  const [guessInput, setGuessInput] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(0);
  const [isAnimatingWord, setIsAnimatingWord] = useState<boolean>(true);
  const [slowMotion, setSlowMotion] = useState<boolean>(false);

  // Mode 2 (Spell Word) state
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [spellFeedback, setSpellFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  // Mode 3 (Rapid Letter Recognition) state
  const [targetRapidLetter, setTargetRapidLetter] = useState<DactylologyLetter>(
    () => DACTYLOLOGY_ALPHABET[0]
  );
  const [rapidFeedback, setRapidFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Adaptive letter interval duration in ms
  const letterDurationMs = useMemo(() => {
    const base =
      activeLevel === 'inicial'
        ? 1350
        : activeLevel === 'intermedio'
        ? 950
        : 680;
    return slowMotion ? Math.round(base * 1.55) : base;
  }, [activeLevel, slowMotion]);

  // Reset states on word or mode change
  useEffect(() => {
    setGuessInput('');
    setGuessFeedback(null);
    setSpelledLetters([]);
    setSpellFeedback(null);
    setActiveLetterIdx(0);
    setIsAnimatingWord(true);
  }, [currentWordItem.id, gameMode]);

  // Step through letters of currentWordItem in Mode 1
  useEffect(() => {
    if (gameMode !== 'guess_word' || !isAnimatingWord) return;
    const chars = currentWordItem.word.split('');
    const interval = setInterval(() => {
      setActiveLetterIdx((prev) => (prev + 1) % chars.length);
    }, letterDurationMs);
    return () => clearInterval(interval);
  }, [gameMode, isAnimatingWord, currentWordItem.word, letterDurationMs]);

  // Determine which DactylologyLetter to render on the interactive Canvas
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

  // Render hand configuration on canvas
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

  // Generate distractors for Mode 1 quick choice & Mode 3 letter choices
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
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header & Adaptive Difficulty Bar */}
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

        {/* Adaptive Status Card */}
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

      {/* 3 Game Mode Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(
          [
            {
              id: 'guess_word',
              title: '1. Adivina la Palabra',
              desc: 'Observa la mano animada deletreando en tiempo real y descubre qué palabra es.'
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

      {/* Two-Column Sandbox: Interactive Hand Stage (6 cols) + Exercise Controls (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Animated Dactylology Hand Viewport */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="relative aspect-4/3 w-full bg-slate-950">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-contain block"
              aria-label="Visor de configuración manual dactilológica"
            />
          </div>

          {gameMode === 'guess_word' && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
              {/* Letter Step Indicators */}
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

        {/* Right: Active Exercise Interaction Deck */}
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

              {/* Direct Text Input */}
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

              {/* Quick Choice Buttons */}
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

              {/* Spelled Slots */}
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

              {/* Interactive Visual Handshape Keyboard */}
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

          {/* Reference Dactylology Description Box */}
          <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Guía de articulación actual:</strong>{' '}
              {displayedLetterObj.handshapeSummary}
            </div>
          </div>
        </div>
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

  // Dark studio backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Reference concentric target circles
  const cx = width / 2;
  const cy = height * 0.56;

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 125, 0, Math.PI * 2);
  ctx.stroke();

  // Draw Articulated Hand Model
  ctx.save();
  ctx.translate(cx, cy + 25);
  ctx.rotate((letterObj.fingers.rotationDeg * Math.PI) / 180);

  // Wrist & Forearm
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(-34, 52, 68, 90);
  ctx.fillStyle = '#f1c27d';
  ctx.fillRect(-26, 26, 52, 32);

  // Palm Base
  ctx.fillStyle = '#ffdbac';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-48, -42, 96, 78, 22);
  ctx.fill();
  ctx.stroke();

  // 4 Fingers (Index, Middle, Ring, Pinky)
  const fingerRatios = [
    letterObj.fingers.index,
    letterObj.fingers.middle,
    letterObj.fingers.ring,
    letterObj.fingers.pinky
  ];
  const baseOffsets = [-32, -11, 11, 32];
  const maxLengths = [86, 94, 88, 72];

  fingerRatios.forEach((ratio, idx) => {
    const xBase = baseOffsets[idx];
    const len = 24 + ratio * maxLengths[idx];
    const spreadRad = (idx - 1.5) * letterObj.fingers.spreadAngle * 0.24;

    ctx.save();
    ctx.translate(xBase, -38);
    ctx.rotate(spreadRad);

    ctx.fillStyle = ratio > 0.45 ? '#ffdbac' : '#e6be8a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-9, -len, 18, len, 9);
    ctx.fill();
    ctx.stroke();

    // Knuckle crease
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.moveTo(-6, -len * 0.55);
    ctx.lineTo(6, -len * 0.55);
    ctx.stroke();
    ctx.restore();
  });

  // Thumb
  ctx.save();
  const thumbRatio = letterObj.fingers.thumb;
  const thumbAngle = -0.35 - thumbRatio * 0.65;
  ctx.translate(-46, -6);
  ctx.rotate(thumbAngle);
  ctx.fillStyle = '#ffdbac';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  const thumbLen = 32 + thumbRatio * 42;
  ctx.beginPath();
  ctx.roundRect(-10, -thumbLen, 20, thumbLen, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Motion indicator if letter has trajectory (Ñ, J, Z)
  if (letterObj.fingers.motionType && letterObj.fingers.motionType !== 'static') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(-55, -135);
    ctx.quadraticCurveTo(0, -155, 55, -135);
    ctx.stroke();
  }

  ctx.restore();

  // Top HUD Bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
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
