import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, Layers, Globe } from 'lucide-react';
import { StudentProgressState } from '../types/learning';

interface GrammarModuleViewProps {
  progress: StudentProgressState;
  onCompleteGrammarModule?: (moduleId: string) => void;
}

interface GrammarTopic {
  id: string;
  title: string;
  category: 'Estructura' | 'Concordancia' | 'Espacio' | 'Prosodia';
  summary: string;
  ruleExplanation: string;
  exampleSpanish: string;
  exampleGloss: string;
  keyTakeaway: string;
}

const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'gram-sov',
    title: 'Estructura de Oraciones (Orden SOV y Tópico-Comentario)',
    category: 'Estructura',
    summary: 'A diferencia del español oral (SVO), la LSE prioriza el orden Sujeto-Objeto-Verbo y la estructura de Tema (Contexto) seguido de Comentario.',
    ruleExplanation: 'En la lengua de signos española, la información conocida o contextual se sitúa primero (Tópico: tiempo, lugar, persona) y la acción o atributo se añade después (Comentario). El verbo principal suele ocupar la posición final de la frase.',
    exampleSpanish: 'Ayer compré una manzana roja en el mercado.',
    exampleGloss: 'AYER MERCADO MANZANA ROJA YO COMPRAR',
    keyTakeaway: 'Sitúa siempre el marco temporal y espacial al inicio de la frase antes de introducir la acción.'
  },
  {
    id: 'gram-genero-numero',
    title: 'Concordancia de Género y Número',
    category: 'Concordancia',
    summary: 'Cómo se expresan las diferencias de género (masculino/femenino) y cómo se pluralizan los signos mediante repetición o numerales.',
    ruleExplanation: '1. Género: Muchos sustantivos son neutros y se acompañan de una seña diferenciadora de sexo ("hombre" / "mujer") o utilizan la flexión natural. 2. Número: El plural se indica añadiendo un numeral exacto (ej. TRES AMIGA), mediante un cuantificador (MUCHAS) o repitiendo el movimiento del signo en arco lateral.',
    exampleSpanish: 'Tres amigas estudian juntas.',
    exampleGloss: 'AMIGA + 3-TRES + JUNTAS ESTUDIAR',
    keyTakeaway: 'Evita añadir artículos o sufijos orales: la pluralización en LSE es espacial, cuantitativa o numérica.'
  },
  {
    id: 'gram-espacio',
    title: 'Uso del Espacio Tridimensional (Loci y Topografía)',
    category: 'Espacio',
    summary: 'El espacio frente al signante no está vacío: se utiliza como un lienzo tridimensional para colocar referentes (loci) y relacionarlos.',
    ruleExplanation: 'Cuando introduces a dos personas en una conversación (ej. Juan y María), asignas un punto en el espacio izquierdo para Juan y otro en el derecho para María. A partir de ese momento, los pronombres y los verbos direccionales apuntarán exactamente a esos puntos (loci) sin necesidad de repetir sus nombres.',
    exampleSpanish: 'Juan ayudó a María en su casa.',
    exampleGloss: 'JUAN (locus izq) MARÍA (locus der) JUAN-AYUDAR-MARÍA',
    keyTakeaway: 'La memoria espacial es la clave de la cohesión discursiva en LSE.'
  },
  {
    id: 'gram-mnm',
    title: 'Componentes No Manuales (MNM) Sintácticos',
    category: 'Prosodia',
    summary: 'La expresión facial, la inclinación de la cabeza y los hombros operan como los signos de puntuación y entonación de la lengua oral.',
    ruleExplanation: 'Un cambio en el marcador facial transforma radicalmente el valor sintáctico de la oración. Por ejemplo, elevar las cejas convierte una afirmación en interrogación polar (¿Sí/No?), mientras que fruncir el ceño acompaña a las preguntas informativas (WH).',
    exampleSpanish: '¿Estudias lengua de signos todos los días?',
    exampleGloss: 'CADA-DÍA TÚ LENGUA-SIGNOS ESTUDIAR [CEJAS ELEVADAS]',
    keyTakeaway: 'Sin componente facial gramatical, el enunciado pierde su modalidad interrogativa o condicional.'
  }
];

export const GrammarModuleView: React.FC<GrammarModuleViewProps> = ({ progress, onCompleteGrammarModule }) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const activeTopic = GRAMMAR_TOPICS.find((t) => t.id === activeTopicId) || GRAMMAR_TOPICS[0];

  const handleToggleComplete = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const next = [...completedTopics, topicId];
      setCompletedTopics(next);
      if (onCompleteGrammarModule) {
        onCompleteGrammarModule(topicId);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono text-sky-700 mb-1">
            MÓDULO GRAMATICAL OFICIAL · LSE Y SINTAXIS ESPACIAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Gramática, Sintaxis y Uso del Espacio
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Comprende las reglas estructurales profundas de la Lengua de Signos Española: orden SOV, concordancia de género y número, y la topografía tridimensional.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 rounded-lg px-3.5 py-2 shrink-0 tabular-nums">
          Temas dominados: <strong className="text-sky-700">{completedTopics.length}</strong> / {GRAMMAR_TOPICS.length}
        </div>
      </div>

      {/* Main Grid: Topic list left / Deep dive right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Topic List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {GRAMMAR_TOPICS.map((topic, idx) => {
            const isSelected = topic.id === activeTopic.id;
            const isDone = completedTopics.includes(topic.id);

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-sky-600 shadow-xs ring-1 ring-sky-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-mono font-semibold text-slate-700">
                    Tema 0{idx + 1} · {topic.category}
                  </span>
                  {isDone && <span className="text-emerald-700 font-semibold">✓ Estudiado</span>}
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{topic.title}</h2>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{topic.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Right Topic Detail Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono text-sky-700 mb-1 uppercase">
                Módulo Gramatical · {activeTopic.category}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">{activeTopic.title}</h2>
            </div>

            <button
              type="button"
              onClick={() => handleToggleComplete(activeTopic.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                completedTopics.includes(activeTopic.id)
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-sky-700 text-white hover:bg-sky-800'
              }`}
            >
              {completedTopics.includes(activeTopic.id) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tema Dominado (✓)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Marcar como Estudiado (+30 XP)</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Explicación Normativa y Regla</h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {activeTopic.ruleExplanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
              <div className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>EJEMPLO PRÁCTICO Y GLOSA SINTÁCTICA LSE</span>
              </div>
              <div className="text-sm text-slate-200">
                <strong>Oración en Español:</strong> "{activeTopic.exampleSpanish}"
              </div>
              <div className="text-xs font-mono text-teal-300">
                <strong>Glosa Estructural LSE:</strong> {activeTopic.exampleGloss}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
              <strong className="font-semibold block text-sky-900 mb-1">Clave fundamental para examen GVA:</strong>
              <p>{activeTopic.keyTakeaway}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
