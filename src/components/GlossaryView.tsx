import React, { useMemo, useState } from 'react';
import { Search, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { GLOSSARY_ENTRIES } from '../data/glossaryAndDactylology';
import {
  GlossaryCategory,
  GlossaryEntry,
  Lesson,
  SkillLevel,
  StudentProgressState
} from '../types/learning';
import { SignVideoPlayer } from './SignVideoPlayer';

interface GlossaryViewProps {
  progress: StudentProgressState;
  onToggleMastered: (termId: string, termName: string) => void;
}

const CATEGORIES: ('Todas' | GlossaryCategory)[] = [
  'Todas',
  'Saludos y Cortesía',
  'Familia y Personas',
  'Vida Cotidiana',
  'Preguntas y Gramática',
  'Tiempo y Verbos',
  'Salud y Emergencias'
];

const ALPHA_GROUPS = [
  { id: 'ALL', label: 'A–Z (Todos)' },
  { id: 'AE', label: 'A – E', regex: /^[AÁBCDEÉ¿]/i },
  { id: 'FJ', label: 'F – J', regex: /^[FGHIÍJ]/i },
  { id: 'KO', label: 'K – O', regex: /^[KLMNÑOÓ]/i },
  { id: 'PT', label: 'P – T', regex: /^[PQRST]/i },
  { id: 'UZ', label: 'U – Z', regex: /^[UÚVWXYZ]/i }
];

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  progress,
  onToggleMastered
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<'Todas' | GlossaryCategory>('Todas');
  const [selectedLevel, setSelectedLevel] = useState<'todos' | SkillLevel>('todos');
  const [alphaFilter, setAlphaFilter] = useState<string>('ALL');
  const [activeEntryId, setActiveEntryId] = useState<string>(
    GLOSSARY_ENTRIES[0].id
  );

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const alphaGroup = ALPHA_GROUPS.find((g) => g.id === alphaFilter);

    return GLOSSARY_ENTRIES.filter((entry) => {
      if (selectedCategory !== 'Todas' && entry.category !== selectedCategory) {
        return false;
      }
      if (selectedLevel !== 'todos' && entry.level !== selectedLevel) {
        return false;
      }
      if (alphaGroup?.regex) {
        const cleanTerm = entry.term.replace(/^[¿¡]/, '');
        if (!alphaGroup.regex.test(cleanTerm)) return false;
      }
      if (q.length > 0) {
        const haystack = `${entry.term} ${entry.description} ${entry.category} ${entry.exampleSentence} ${entry.handshape}`.toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel, alphaFilter]);

  const activeEntry: GlossaryEntry = useMemo(() => {
    const inFiltered = filteredEntries.find((e) => e.id === activeEntryId);
    if (inFiltered) return inFiltered;
    if (filteredEntries.length > 0) return filteredEntries[0];
    return GLOSSARY_ENTRIES[0];
  }, [filteredEntries, activeEntryId]);

  // Adapt GlossaryEntry into the Lesson shape expected by SignVideoPlayer
  const playerLessonAdapter: Lesson = useMemo(
    () => ({
      id: activeEntry.id,
      number: 'GLOS',
      title: activeEntry.term,
      subtitle: activeEntry.description,
      level: activeEntry.level,
      durationMinutes: 2,
      category: activeEntry.category,
      summary: activeEntry.description,
      learningObjectives: [],
      biomechanics: {
        configuracionManual: activeEntry.handshape,
        ubicacionEspacial: activeEntry.location,
        trayectoriaMovimiento: activeEntry.movement,
        marcadorFacial: activeEntry.nonManualMarker
      },
      targetFacialExpression: 'neutral_atento',
      facialExercisePrompt: activeEntry.nonManualMarker,
      vocabulary: [],
      keyframes: activeEntry.keyframes,
      quiz: [],
      offlineTips: []
    }),
    [activeEntry]
  );

  const isMastered = progress.glossaryMasteredIds.includes(activeEntry.id);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono text-sky-700 mb-1">
            DICCIONARIO VISUAL INTERACTIVO · VÍDEO INCRUSTADO EN TIEMPO REAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Glosario Interactivo de Lengua de Signos
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Busca cualquier término, explora su descripción biomecánica detallada y observa el vídeo demostrativo integrado con vectores de movimiento.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 rounded-lg px-3.5 py-2 shrink-0 tabular-nums">
          Signos dominados: <strong className="text-sky-700">{progress.glossaryMasteredIds.length}</strong> / {GLOSSARY_ENTRIES.length}
        </div>
      </div>

      {/* Search & Multi-Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar término, descripción o ejemplo (ej. Gracias, Amiga, ¿Dónde?, Médico)..."
              aria-label="Buscar en el glosario"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-2 focus:outline-sky-600"
            />
          </div>

          {/* Level Segmented Control */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-1.5">
            {(
              [
                { id: 'todos', label: 'Todos los niveles' },
                { id: 'inicial', label: 'Inicial' },
                { id: 'intermedio', label: 'Intermedio' },
                { id: 'avanzado', label: 'Avanzado' }
              ] as const
            ).map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedLevel === lvl.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-50 border-sky-600 text-sky-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Alphabetical Quick Filter */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Índice A–Z:</span>
            {ALPHA_GROUPS.map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => setAlphaFilter(grp.id)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  alphaFilter === grp.id
                    ? 'bg-sky-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Mostrando {filteredEntries.length} de {GLOSSARY_ENTRIES.length} términos
          </div>
        </div>
      </div>

      {/* Two-Column Split: Searchable Dictionary List (5 cols) + Embedded Video Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Term Directory List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredEntries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <BookOpen className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">
                No se encontraron términos con esos filtros
              </div>
              <p className="text-xs text-slate-500">
                Prueba limpiando el texto de búsqueda o seleccionando "Todas" las categorías.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todas');
                  setSelectedLevel('todos');
                  setAlphaFilter('ALL');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = entry.id === activeEntry.id;
              const done = progress.glossaryMasteredIds.includes(entry.id);

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveEntryId(entry.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-sky-600 ring-1 ring-sky-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <div>
                      <span>{entry.category}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="capitalize">Nivel {entry.level}</span>
                    </div>
                    {done && (
                      <span className="text-emerald-700 font-semibold">
                        ✓ Dominado
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-slate-900">
                    {entry.term}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {entry.description}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Embedded Video Studio & Detailed Entry View */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">
                <span>{activeEntry.category}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span className="capitalize">Nivel {activeEntry.level}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {activeEntry.term}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onToggleMastered(activeEntry.id, activeEntry.term)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isMastered
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-sky-700 text-white hover:bg-sky-800'
              }`}
            >
              {isMastered ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Signo Dominado (✓)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Marcar como Aprendido (+25 XP)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {activeEntry.description}
          </p>

          {/* Embedded Sign Video Player */}
          <div>
            <div className="text-xs font-semibold text-slate-800 mb-2">
              Demostración en Vídeo Integrado (Sin salir de la web)
            </div>
            <SignVideoPlayer lesson={playerLessonAdapter} />
          </div>

          {/* 4 Parameters Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-semibold text-slate-900 mb-1">
                Configuración Manual
              </div>
              <p className="text-slate-600">{activeEntry.handshape}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-semibold text-slate-900 mb-1">
                Ubicación Espacial
              </div>
              <p className="text-slate-600">{activeEntry.location}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-semibold text-slate-900 mb-1">
                Trayectoria y Movimiento
              </div>
              <p className="text-slate-600">{activeEntry.movement}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="font-semibold text-slate-900 mb-1">
                Marcador Facial (MNM)
              </div>
              <p className="text-slate-600">{activeEntry.nonManualMarker}</p>
            </div>
          </div>

          {/* Contextual Sentence & SOV Gloss */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="text-xs font-mono text-sky-400">
              EJEMPLO DE USO EN CONTEXTO Y GLOSA SINTÁCTICA
            </div>
            <div className="text-sm text-slate-200">
              <strong>Español:</strong> "{activeEntry.exampleSentence}"
            </div>
            <div className="text-xs font-mono text-teal-300">
              <strong>Estructura Signada (Glosa):</strong> {activeEntry.exampleGloss}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
