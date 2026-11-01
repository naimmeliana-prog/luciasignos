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

type GameMode = 'guess_word' | 'spell_word' | 'rapid_letter' | 'alphabet_table';

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              desc: 'Consulta la tabla oficial con las 27 configuraciones manuales del alfabeto dactilológico.'
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
        {gameMode === 'alphabet_table' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
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
                  <div className="w-full h-28 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-800 group-hover:border-sky-500 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-sky-400 group-hover:scale-105 transition-transform" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="30" y="55" width="40" height="35" rx="8" fill="rgba(2,132,199,0.15)" stroke="currentColor" />
                        <circle cx="50" cy="40" r="14" fill="rgba(2,132,199,0.25)" />
                        <path d={`M40 55 L${38 + item.fingers.thumb * 8} ${35 - item.fingers.thumb * 15} M46 55 L46 ${22 - item.fingers.index * 12} M54 55 L54 ${22 - item.fingers.middle * 12} M60 55 L62 ${28 - item.fingers.ring * 10}`} />
                        <text x="50" y="45" textAnchor="middle" fill="#38bdf8" fontSize="16" fontFamily="monospace" fontWeight="bold">{item.letter}</text>
                      </svg>
                    </div>
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-sky-300 border border-slate-700">
                      CLIC PARA VER DETALLES
                    </div>
                  </div>

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

      {gameMode !== 'alphabet_table' && (
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

      {selectedAlphabetItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-sky-700 text-white font-mono font-bold text-2xl flex items-center justify-center shadow-md">
                  {selectedAlphabetItem.letter}
                </span>
                <div>
                  <div className="text-xs font-mono text-sky-700">REFERENCIA DACTILOLÓGICA OFICIAL LSE</div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedAlphabetItem.name}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlphabetItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="w-full h-48 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-32 h-32 text-sky-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="25" y="50" width="50" height="40" rx="10" fill="rgba(2,132,199,0.15)" stroke="currentColor" />
                    <circle cx="50" cy="35" r="16" fill="rgba(2,132,199,0.25)" />
                    <path d={`M35 50 L${35 + selectedAlphabetItem.fingers.thumb * 20} ${50 - selectedAlphabetItem.fingers.thumb * 25} M45 50 L45 ${25 - selectedAlphabetItem.fingers.index * 15} M55 50 L55 ${20 - selectedAlphabetItem.fingers.middle * 15} M65 50 L65 ${25 - selectedAlphabetItem.fingers.ring * 15} M75 50 L80 ${35 - selectedAlphabetItem.fingers.pinky * 10}`} />
                    <text x="50" y="40" textAnchor="middle" fill="#38bdf8" fontSize="22" fontFamily="monospace" fontWeight="bold">{selectedAlphabetItem.letter}</text>
                  </svg>
                </div>
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-sky-300 border border-slate-700">
                  VISTA ANATÓMICA DETALLADA · LETRA {selectedAlphabetItem.letter}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900">Resumen de Configuración Manual:</div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                  {selectedAlphabetItem.handshapeSummary}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900">Pautas Biomecánicas y Tip de Ejecución:</div>
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-950">
                  {selectedAlphabetItem.tip}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Pulgar</div>
                  <div className="font-bold text-slate-900">{Math.round(selectedAlphabetItem.fingers.thumb * 100)}%</div>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Índice</div>
                  <div className="font-bold text-slate-900">{Math.round(selectedAlphabetItem.fingers.index * 100)}%</div>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Rotación</div>
                  <div className="font-bold text-slate-900">{selectedAlphabetItem.fingers.rotationDeg}°</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAlphabetItem(null)}
                className="px-5 py-2.5 bg-sky-700 text-white rounded-xl text-xs font-semibold hover:bg-sky-800 cursor-pointer"
              >
                Entendido, Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
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
