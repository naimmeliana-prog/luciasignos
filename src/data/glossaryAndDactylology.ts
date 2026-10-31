import {
  GlossaryEntry,
  DactylologyLetter,
  FingerspellingWordItem,
  GamificationBadge
} from '../types/learning';

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'glos-hola',
    term: 'Hola',
    category: 'Saludos y Cortesía',
    level: 'inicial',
    description:
      'Saludo universal de apertura comunicativa. Parte desde el lateral de la frente (sien) con la mano plana y se proyecta en un arco corto hacia afuera acompañado de contacto visual.',
    handshape: 'Configuración B (mano plana, dedos unidos)',
    location: 'Sien o lateral superior de la frente',
    movement: 'Arco corto hacia adelante y afuera',
    nonManualMarker: 'Sonrisa cordial y leve elevación de cejas',
    exampleSentence: '¡Hola! Qué alegría verte hoy.',
    exampleGloss: 'HOLA HOY TÚ-VER ALEGRÍA',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Contacto inicial próximo a la sien',
        durationMs: 1100,
        leftHand: { x: 0.34, y: 0.72, rotation: -8, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.60, y: 0.32, rotation: -20, fingerSpread: 0.9, shapeLabel: 'Mano B en sien' },
        eyebrowArch: 0.35,
        mouthOpen: 0.15,
        mouthSmile: 0.75,
        headTilt: 3,
        motionArrow: { fromX: 0.60, fromY: 0.32, toX: 0.74, toY: 0.29, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Proyección abierta de saludo',
        durationMs: 1200,
        leftHand: { x: 0.34, y: 0.72, rotation: -8, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.74, y: 0.29, rotation: 16, fingerSpread: 1.0, shapeLabel: 'Apertura Hola' },
        eyebrowArch: 0.45,
        mouthOpen: 0.2,
        mouthSmile: 0.9,
        headTilt: 5
      }
    ]
  },
  {
    id: 'glos-gracias',
    term: 'Gracias',
    category: 'Saludos y Cortesía',
    level: 'inicial',
    description:
      'Expresión esencial de agradecimiento. Las yemas de la mano dominante tocan suavemente la barbilla y se desplazan hacia el interlocutor con una leve inclinación de cabeza.',
    handshape: 'Mano plana abierta (Configuración B)',
    location: 'Mentón / barbilla',
    movement: 'Trayectoria lineal frontal descendente hacia el interlocutor',
    nonManualMarker: 'Sonrisa afectiva + asentimiento suave',
    exampleSentence: 'Muchas gracias por tu ayuda.',
    exampleGloss: 'TU AYUDA MUCHAS-GRACIAS',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Yemas sobre el mentón',
        durationMs: 1100,
        leftHand: { x: 0.35, y: 0.72, rotation: -5, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.52, y: 0.44, rotation: -5, fingerSpread: 0.85, shapeLabel: 'Mentón' },
        eyebrowArch: 0.25,
        mouthOpen: 0.1,
        mouthSmile: 0.8,
        headTilt: 0,
        motionArrow: { fromX: 0.52, fromY: 0.44, toX: 0.67, toY: 0.55, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Entrega frontal hacia el receptor',
        durationMs: 1200,
        leftHand: { x: 0.35, y: 0.72, rotation: -5, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.67, y: 0.55, rotation: 24, fingerSpread: 0.95, shapeLabel: 'Proyección' },
        eyebrowArch: 0.3,
        mouthOpen: 0.18,
        mouthSmile: 0.95,
        headTilt: -4
      }
    ]
  },
  {
    id: 'glos-por-favor',
    term: 'Por favor',
    category: 'Saludos y Cortesía',
    level: 'inicial',
    description:
      'Fórmula de cortesía para realizar peticiones amables. La palma abierta reposa sobre el centro del pecho y traza dos círculos suaves en sentido horario.',
    handshape: 'Palma abierta apoyada en el tórax',
    location: 'Centro del pecho',
    movement: 'Movimiento circular continuo sobre el esternón',
    nonManualMarker: 'Cejas levemente elevadas e inclinación amable',
    exampleSentence: 'Repite el signo más despacio, por favor.',
    exampleGloss: 'POR-FAVOR SIGNO DESPACIO REPETIR',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Palma en centro del pecho',
        durationMs: 1100,
        leftHand: { x: 0.34, y: 0.74, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.50, y: 0.56, rotation: -12, fingerSpread: 0.9, shapeLabel: 'Palma en pecho' },
        eyebrowArch: 0.4,
        mouthOpen: 0.12,
        mouthSmile: 0.65,
        headTilt: 4,
        motionArrow: { fromX: 0.50, fromY: 0.56, toX: 0.56, toY: 0.62, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Rotación circular cordial',
        durationMs: 1200,
        leftHand: { x: 0.34, y: 0.74, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.55, y: 0.60, rotation: 8, fingerSpread: 0.9, shapeLabel: 'Giro suave' },
        eyebrowArch: 0.45,
        mouthOpen: 0.15,
        mouthSmile: 0.75,
        headTilt: 6
      }
    ]
  },
  {
    id: 'glos-amiga',
    term: 'Amiga / Amigo',
    category: 'Familia y Personas',
    level: 'inicial',
    description:
      'Representa el vínculo de amistad estrecha. Ambos dedos índices flexionados en forma de gancho se entrelazan dos veces invirtiendo la posición superior.',
    handshape: 'Índices curvados (Configuración X) o manos unidas',
    location: 'Espacio neutro central frente al pecho',
    movement: 'Doble enganche recíproco',
    nonManualMarker: 'Sonrisa cercana y expresión afectiva',
    exampleSentence: 'Mi amiga aprende lengua de signos conmigo.',
    exampleGloss: 'MI AMIGA CONMIGO LENGUA-SIGNOS APRENDER',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Primer enlace de índices en el centro',
        durationMs: 1150,
        leftHand: { x: 0.45, y: 0.56, rotation: 22, fingerSpread: 0.35, shapeLabel: 'Índice en gancho' },
        rightHand: { x: 0.55, y: 0.54, rotation: -22, fingerSpread: 0.35, shapeLabel: 'Enlace superior' },
        eyebrowArch: 0.3,
        mouthOpen: 0.2,
        mouthSmile: 0.85,
        headTilt: 3
      },
      {
        phaseLabel: 'Fase 2: Inversión recíproca del vínculo',
        durationMs: 1150,
        leftHand: { x: 0.46, y: 0.54, rotation: -18, fingerSpread: 0.35, shapeLabel: 'Enlace superior' },
        rightHand: { x: 0.54, y: 0.57, rotation: 18, fingerSpread: 0.35, shapeLabel: 'Enlace inferior' },
        eyebrowArch: 0.35,
        mouthOpen: 0.25,
        mouthSmile: 0.9,
        headTilt: -3
      }
    ]
  },
  {
    id: 'glos-familia',
    term: 'Familia',
    category: 'Familia y Personas',
    level: 'inicial',
    description:
      'Ambas manos en configuración F inician unidas frente al pecho y trazan un círculo horizontal envolvente hasta que los meñiques se tocan, simbolizando el núcleo familiar.',
    handshape: 'Ambas manos en configuración F (índice y pulgar unidos)',
    location: 'Espacio neutro frente al torso',
    movement: 'Arco circular simétrico hacia afuera que se cierra al frente',
    nonManualMarker: 'Expresión cálida y acogedora',
    exampleSentence: 'El domingo ceno con toda mi familia.',
    exampleGloss: 'DOMINGO MI FAMILIA TODA CENAR',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Inicio con manos unidas en el centro',
        durationMs: 1200,
        leftHand: { x: 0.46, y: 0.55, rotation: 10, fingerSpread: 0.65, shapeLabel: 'Mano F izq.' },
        rightHand: { x: 0.54, y: 0.55, rotation: -10, fingerSpread: 0.65, shapeLabel: 'Mano F der.' },
        eyebrowArch: 0.2,
        mouthOpen: 0.1,
        mouthSmile: 0.7,
        headTilt: 0,
        motionArrow: { fromX: 0.54, fromY: 0.55, toX: 0.68, toY: 0.62, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Círculo envolvente de unión',
        durationMs: 1200,
        leftHand: { x: 0.36, y: 0.62, rotation: -20, fingerSpread: 0.65, shapeLabel: 'Arco izq.' },
        rightHand: { x: 0.64, y: 0.62, rotation: 20, fingerSpread: 0.65, shapeLabel: 'Arco der.' },
        eyebrowArch: 0.25,
        mouthOpen: 0.15,
        mouthSmile: 0.8,
        headTilt: 2
      }
    ]
  },
  {
    id: 'glos-casa',
    term: 'Casa / Hogar',
    category: 'Vida Cotidiana',
    level: 'inicial',
    description:
      'Las dos manos planas unen sus yemas formando un tejado triangular a dos aguas y descienden ligeramente marcando las paredes del hogar.',
    handshape: 'Ambas manos planas (Configuración B)',
    location: 'Espacio neutro a la altura del pecho',
    movement: 'Unión de yemas en ángulo diagonal seguida de breve descenso vertical',
    nonManualMarker: 'Expresión serena y labialización suave de "casa"',
    exampleSentence: 'Hoy practico signos en mi casa.',
    exampleGloss: 'HOY MI CASA YO SIGNOS PRACTICAR',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Formación del tejado con ambas manos',
        durationMs: 1150,
        leftHand: { x: 0.44, y: 0.48, rotation: 35, fingerSpread: 0.85, shapeLabel: 'Vertiente izq.' },
        rightHand: { x: 0.56, y: 0.48, rotation: -35, fingerSpread: 0.85, shapeLabel: 'Vertiente der.' },
        eyebrowArch: 0.15,
        mouthOpen: 0.25,
        mouthSmile: 0.5,
        headTilt: 0,
        motionArrow: { fromX: 0.56, fromY: 0.48, toX: 0.62, toY: 0.58, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Contorno lateral de las paredes',
        durationMs: 1150,
        leftHand: { x: 0.38, y: 0.58, rotation: 5, fingerSpread: 0.85, shapeLabel: 'Pared izq.' },
        rightHand: { x: 0.62, y: 0.58, rotation: -5, fingerSpread: 0.85, shapeLabel: 'Pared der.' },
        eyebrowArch: 0.2,
        mouthOpen: 0.15,
        mouthSmile: 0.6,
        headTilt: 0
      }
    ]
  },
  {
    id: 'glos-agua',
    term: 'Agua',
    category: 'Vida Cotidiana',
    level: 'inicial',
    description:
      'El dedo índice o configuración en tres dedos toca lateralmente la comisura del mentón con dos pequeños toques, evocando el acto de beber.',
    handshape: 'Configuración L o W próxima a la boca',
    location: 'Lateral de la barbilla / mejilla inferior',
    movement: 'Doble toque suave sobre el mentón',
    nonManualMarker: 'Labialización clara de "agua"',
    exampleSentence: '¿Quieres un vaso de agua fresca?',
    exampleGloss: 'AGUA FRESCA VASO ¿TÚ-QUERER?',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Aproximación al mentón lateral',
        durationMs: 1000,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.56, y: 0.45, rotation: -15, fingerSpread: 0.55, shapeLabel: 'Toque 1' },
        eyebrowArch: 0.2,
        mouthOpen: 0.35,
        mouthSmile: 0.3,
        headTilt: 2
      },
      {
        phaseLabel: 'Fase 2: Segundo toque de confirmación',
        durationMs: 1000,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.53, y: 0.43, rotation: -22, fingerSpread: 0.55, shapeLabel: 'Toque 2' },
        eyebrowArch: 0.25,
        mouthOpen: 0.2,
        mouthSmile: 0.45,
        headTilt: 0
      }
    ]
  },
  {
    id: 'glos-cafe',
    term: 'Café',
    category: 'Vida Cotidiana',
    level: 'inicial',
    description:
      'El puño dominante realiza un movimiento circular horizontal sobre el puño base, representando el molinillo tradicional de granos de café.',
    handshape: 'Ambos puños cerrados (Configuración S/A)',
    location: 'Espacio neutro central',
    movement: 'Rotación circular de la mano superior sobre la inferior',
    nonManualMarker: 'Expresión cordial de invitación',
    exampleSentence: 'Mañana por la tarde tomamos un café.',
    exampleGloss: 'MAÑANA TARDE NOSOTRAS CAFÉ TOMAR',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Puño superior sobre base',
        durationMs: 1100,
        leftHand: { x: 0.46, y: 0.60, rotation: 0, fingerSpread: 0.1, shapeLabel: 'Base molinillo' },
        rightHand: { x: 0.48, y: 0.50, rotation: -15, fingerSpread: 0.15, shapeLabel: 'Giro café 1' },
        eyebrowArch: 0.2,
        mouthOpen: 0.15,
        mouthSmile: 0.65,
        headTilt: 2,
        motionArrow: { fromX: 0.48, fromY: 0.50, toX: 0.56, toY: 0.52, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Rotación circular del molinillo',
        durationMs: 1100,
        leftHand: { x: 0.46, y: 0.60, rotation: 0, fingerSpread: 0.1, shapeLabel: 'Base molinillo' },
        rightHand: { x: 0.55, y: 0.52, rotation: 15, fingerSpread: 0.15, shapeLabel: 'Giro café 2' },
        eyebrowArch: 0.25,
        mouthOpen: 0.2,
        mouthSmile: 0.7,
        headTilt: -2
      }
    ]
  },
  {
    id: 'glos-aprender',
    term: 'Aprender',
    category: 'Tiempo y Verbos',
    level: 'intermedio',
    description:
      'La mano dominante recoge simbólicamente el conocimiento depositado en la palma abierta no dominante y lo lleva hacia la frente cerrando las yemas.',
    handshape: 'Mano plana base + mano activa que une sus dedos al subir a la sien',
    location: 'Desde la palma inferior hasta la frente',
    movement: 'Trayectoria ascendente de integración mental',
    nonManualMarker: 'Mirada atenta y asentimiento comprensivo',
    exampleSentence: 'Quiero aprender nuevos signos cada día.',
    exampleGloss: 'CADA-DÍA SIGNOS NUEVOS YO APRENDER QUERER',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Captar información de la palma base',
        durationMs: 1200,
        leftHand: { x: 0.42, y: 0.62, rotation: 18, fingerSpread: 0.9, shapeLabel: 'Palma libro' },
        rightHand: { x: 0.48, y: 0.55, rotation: -18, fingerSpread: 0.85, shapeLabel: 'Tomar saber' },
        eyebrowArch: 0.25,
        mouthOpen: 0.15,
        mouthSmile: 0.45,
        headTilt: 0,
        motionArrow: { fromX: 0.48, fromY: 0.55, toX: 0.56, toY: 0.32, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Integrar conocimiento en la frente',
        durationMs: 1200,
        leftHand: { x: 0.42, y: 0.62, rotation: 18, fingerSpread: 0.9, shapeLabel: 'Palma libro' },
        rightHand: { x: 0.56, y: 0.32, rotation: -32, fingerSpread: 0.2, shapeLabel: 'Mente / Sien' },
        eyebrowArch: 0.4,
        mouthOpen: 0.1,
        mouthSmile: 0.7,
        headTilt: -3
      }
    ]
  },
  {
    id: 'glos-entender',
    term: 'Entender / Comprender',
    category: 'Tiempo y Verbos',
    level: 'intermedio',
    description:
      'El dedo índice o pulgar se proyecta hacia arriba junto a la sien como una bombilla que se enciende, acompañado de un claro asentimiento de cabeza.',
    handshape: 'Puño cerrado que extiende el índice/pulgar hacia arriba',
    location: 'Lateral de la frente (sien)',
    movement: 'Apertura rápida ascendente del dedo + cabeceo afirmativo',
    nonManualMarker: 'Elevación de cejas de iluminación mental ("¡Ah, ya entiendo!")',
    exampleSentence: 'Ahora entiendo perfectamente la gramática facial.',
    exampleGloss: 'AHORA GRAMÁTICA FACIAL YO ENTENDER PERFECTO',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Mano cerrada junto a la sien',
        durationMs: 1050,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.25, shapeLabel: 'Reposo' },
        rightHand: { x: 0.60, y: 0.34, rotation: -15, fingerSpread: 0.15, shapeLabel: 'Proceso mental' },
        eyebrowArch: 0.1,
        mouthOpen: 0.1,
        mouthSmile: 0.2,
        headTilt: 0
      },
      {
        phaseLabel: 'Fase 2: Apertura de comprensión en la sien',
        durationMs: 1150,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.25, shapeLabel: 'Reposo' },
        rightHand: { x: 0.62, y: 0.30, rotation: -5, fingerSpread: 0.7, shapeLabel: '¡Entendido!' },
        eyebrowArch: 0.75,
        mouthOpen: 0.25,
        mouthSmile: 0.85,
        headTilt: 5
      }
    ]
  },
  {
    id: 'glos-que-pregunta',
    term: '¿Qué? (Interrogativo)',
    category: 'Preguntas y Gramática',
    level: 'intermedio',
    description:
      'Signo interrogativo abierto. Las palmas hacia arriba oscilan horizontalmente mientras las cejas se fruncen ligeramente para marcar pregunta pronominal.',
    handshape: 'Ambas manos abiertas con palmas hacia el techo',
    location: 'Espacio neutro medio',
    movement: 'Oscilación lateral corta de muñecas',
    nonManualMarker: 'Ceño levemente contraído + mentón adelantado',
    exampleSentence: '¿Qué signo quieres aprender hoy?',
    exampleGloss: 'HOY SIGNO APRENDER TÚ-QUERER ¿QUÉ?',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Apertura de palmas interrogativas',
        durationMs: 1100,
        leftHand: { x: 0.36, y: 0.58, rotation: -20, fingerSpread: 0.85, shapeLabel: 'Palma arriba' },
        rightHand: { x: 0.64, y: 0.58, rotation: 20, fingerSpread: 0.85, shapeLabel: 'Palma arriba' },
        eyebrowArch: -0.65,
        mouthOpen: 0.25,
        mouthSmile: 0.0,
        headTilt: -4,
        motionArrow: { fromX: 0.64, fromY: 0.58, toX: 0.72, toY: 0.58, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Vaivén lateral con marcador facial WH',
        durationMs: 1150,
        leftHand: { x: 0.30, y: 0.58, rotation: -30, fingerSpread: 0.9, shapeLabel: '¿Qué?' },
        rightHand: { x: 0.70, y: 0.58, rotation: 30, fingerSpread: 0.9, shapeLabel: '¿Qué?' },
        eyebrowArch: -0.8,
        mouthOpen: 0.3,
        mouthSmile: -0.05,
        headTilt: 5
      }
    ]
  },
  {
    id: 'glos-donde-pregunta',
    term: '¿Dónde?',
    category: 'Preguntas y Gramática',
    level: 'intermedio',
    description:
      'Pregunta por la ubicación espacial. Se articula con oscilación de la mano o índice acompañada obligatoriamente por el fruncimiento interrogativo de cejas.',
    handshape: 'Dedo índice extendido o palmas abiertas hacia arriba',
    location: 'Espacio neutro frontal',
    movement: 'Pequeño desplazamiento oscilante de izquierda a derecha',
    nonManualMarker: 'Cejas juntas + mirada exploratoria',
    exampleSentence: '¿Dónde está la biblioteca?',
    exampleGloss: 'BIBLIOTECA ESTAR ¿DÓNDE?',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Posición de búsqueda izquierda',
        durationMs: 1100,
        leftHand: { x: 0.35, y: 0.70, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Apoyo' },
        rightHand: { x: 0.58, y: 0.48, rotation: -18, fingerSpread: 0.5, shapeLabel: '¿Dónde? (Izq)' },
        eyebrowArch: -0.6,
        mouthOpen: 0.2,
        mouthSmile: 0.0,
        headTilt: -5,
        motionArrow: { fromX: 0.58, fromY: 0.48, toX: 0.68, toY: 0.48, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Oscilación de búsqueda derecha',
        durationMs: 1100,
        leftHand: { x: 0.35, y: 0.70, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Apoyo' },
        rightHand: { x: 0.68, y: 0.48, rotation: 18, fingerSpread: 0.5, shapeLabel: '¿Dónde? (Der)' },
        eyebrowArch: -0.75,
        mouthOpen: 0.25,
        mouthSmile: 0.0,
        headTilt: 5
      }
    ]
  },
  {
    id: 'glos-ayudar',
    term: 'Ayudar (Verbo Direccional)',
    category: 'Salud y Emergencias',
    level: 'avanzado',
    description:
      'Verbo espacial direccional: el puño con pulgar hacia arriba reposa sobre la palma abierta de la otra mano. Si se mueve de mí hacia ti significa "Te ayudo"; si viene de ti hacia mí significa "Ayúdame".',
    handshape: 'Mano A apoyada sobre palma plana B',
    location: 'Espacio neutro con trayectoria entre emisor y receptor',
    movement: 'Desplazamiento direccional hacia quien recibe la ayuda',
    nonManualMarker: 'Mirada dirigida al receptor + expresión de disposición o urgencia',
    exampleSentence: '¿Necesitas que te ayude ahora?',
    exampleGloss: 'AHORA YO-AYUDAR-A-TI ¿NECESITAR?',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Formación del signo cerca del cuerpo',
        durationMs: 1200,
        leftHand: { x: 0.46, y: 0.58, rotation: 10, fingerSpread: 0.9, shapeLabel: 'Palma sostén' },
        rightHand: { x: 0.48, y: 0.53, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Pulgar apoyo' },
        eyebrowArch: 0.45,
        mouthOpen: 0.15,
        mouthSmile: 0.5,
        headTilt: 2,
        motionArrow: { fromX: 0.48, fromY: 0.55, toX: 0.68, toY: 0.52, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Desplazamiento direccional hacia el receptor',
        durationMs: 1200,
        leftHand: { x: 0.62, y: 0.54, rotation: 14, fingerSpread: 0.9, shapeLabel: 'Entrega ayuda' },
        rightHand: { x: 0.65, y: 0.49, rotation: 5, fingerSpread: 0.2, shapeLabel: 'Yo te ayudo' },
        eyebrowArch: 0.55,
        mouthOpen: 0.2,
        mouthSmile: 0.65,
        headTilt: 5
      }
    ]
  },
  {
    id: 'glos-medico-salud',
    term: 'Médico / Hospital',
    category: 'Salud y Emergencias',
    level: 'avanzado',
    description:
      'Los dedos índice y medio toman simbólicamente el pulso en la muñeca opuesta o trazan una pequeña cruz sanitaria en el brazo superior.',
    handshape: 'Índice y medio unidos (Configuración U/N)',
    location: 'Interior de la muñeca no dominante',
    movement: 'Doble toque firme sobre el pulso arterial',
    nonManualMarker: 'Expresión seria o de consulta clínica',
    exampleSentence: 'Mañana tengo cita con el médico.',
    exampleGloss: 'MAÑANA MÉDICO CITA YO-TENER',
    keyframes: [
      {
        phaseLabel: 'Fase 1: Presentación de muñeca base',
        durationMs: 1150,
        leftHand: { x: 0.44, y: 0.60, rotation: 25, fingerSpread: 0.5, shapeLabel: 'Muñeca pulso' },
        rightHand: { x: 0.56, y: 0.50, rotation: -20, fingerSpread: 0.5, shapeLabel: 'Dedos en U' },
        eyebrowArch: 0.15,
        mouthOpen: 0.1,
        mouthSmile: 0.2,
        headTilt: 0,
        motionArrow: { fromX: 0.56, fromY: 0.50, toX: 0.46, toY: 0.58, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Contacto sobre el pulso',
        durationMs: 1150,
        leftHand: { x: 0.44, y: 0.60, rotation: 25, fingerSpread: 0.5, shapeLabel: 'Muñeca pulso' },
        rightHand: { x: 0.46, y: 0.57, rotation: -30, fingerSpread: 0.45, shapeLabel: 'Médico / Salud' },
        eyebrowArch: 0.2,
        mouthOpen: 0.15,
        mouthSmile: 0.3,
        headTilt: 3
      }
    ]
  }
];

export const DACTYLOLOGY_ALPHABET: DactylologyLetter[] = [
  {
    letter: 'A',
    name: 'Letra A',
    handshapeSummary: 'Puño cerrado con el pulgar extendido verticalmente en el lateral.',
    tip: 'Mantén los cuatro dedos bien plegados y el pulgar pegado al costado del índice.',
    fingers: { thumb: 0.9, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.1, rotationDeg: 0 }
  },
  {
    letter: 'B',
    name: 'Letra B',
    handshapeSummary: 'Cuatro dedos completamente estirados y unidos; pulgar cruzado sobre la palma.',
    tip: 'No separes los dedos entre sí; la palma mira de frente al interlocutor.',
    fingers: { thumb: 0.1, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0, spreadAngle: 0.05, rotationDeg: 0 }
  },
  {
    letter: 'C',
    name: 'Letra C',
    handshapeSummary: 'Todos los dedos curvados dibujando la silueta semicircular de una C.',
    tip: 'Imagina que sostienes un vaso cilíndrico pequeño de perfil.',
    fingers: { thumb: 0.65, index: 0.55, middle: 0.55, ring: 0.55, pinky: 0.55, spreadAngle: 0.2, rotationDeg: -22 }
  },
  {
    letter: 'D',
    name: 'Letra D',
    handshapeSummary: 'Dedo índice verticalmente estirado; medio, anular y meñique unidos al pulgar.',
    tip: 'El círculo inferior junto con el índice recto forman visualmente una "d" minúscula.',
    fingers: { thumb: 0.45, index: 1.0, middle: 0.25, ring: 0.25, pinky: 0.25, spreadAngle: 0.15, rotationDeg: 0 }
  },
  {
    letter: 'E',
    name: 'Letra E',
    handshapeSummary: 'Los cinco dedos flexionados en garra suave hacia el centro de la palma.',
    tip: 'Deja un pequeño espacio entre las yemas y la palma para que no se confunda con el puño A.',
    fingers: { thumb: 0.25, index: 0.35, middle: 0.35, ring: 0.35, pinky: 0.35, spreadAngle: 0.15, rotationDeg: 0 }
  },
  {
    letter: 'F',
    name: 'Letra F',
    handshapeSummary: 'Índice y pulgar unidos en pinza; medio, anular y meñique estirados arriba.',
    tip: 'Los tres dedos libres deben permanecer erguidos y ligeramente separados.',
    fingers: { thumb: 0.4, index: 0.25, middle: 1.0, ring: 1.0, pinky: 1.0, spreadAngle: 0.45, rotationDeg: 0 }
  },
  {
    letter: 'G',
    name: 'Letra G',
    handshapeSummary: 'Índice y pulgar extendidos paralelos en horizontal como una pinza abierta.',
    tip: 'Orienta la mano de perfil para que el receptor vea la separación entre índice y pulgar.',
    fingers: { thumb: 0.85, index: 0.9, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.3, rotationDeg: -65 }
  },
  {
    letter: 'H',
    name: 'Letra H',
    handshapeSummary: 'Índice y medio estirados y unidos en posición horizontal.',
    tip: 'Es igual a la U pero girada 90 grados en horizontal.',
    fingers: { thumb: 0.15, index: 0.95, middle: 0.95, ring: 0.05, pinky: 0.05, spreadAngle: 0.08, rotationDeg: -70 }
  },
  {
    letter: 'I',
    name: 'Letra I',
    handshapeSummary: 'Puño cerrado con únicamente el dedo meñique completamente estirado hacia arriba.',
    tip: 'Mantén la muñeca recta y firme.',
    fingers: { thumb: 0.15, index: 0.05, middle: 0.05, ring: 0.05, pinky: 1.0, spreadAngle: 0.2, rotationDeg: 0 }
  },
  {
    letter: 'J',
    name: 'Letra J',
    handshapeSummary: 'Desde la configuración de la I, el meñique dibuja en el aire la curva inferior de una J.',
    tip: 'El movimiento termina hacia adentro y arriba.',
    fingers: { thumb: 0.15, index: 0.05, middle: 0.05, ring: 0.05, pinky: 1.0, spreadAngle: 0.2, rotationDeg: 18, motionType: 'tilde_wave' }
  },
  {
    letter: 'K',
    name: 'Letra K',
    handshapeSummary: 'Índice vertical, medio inclinado hacia adelante y pulgar apoyado en la base entre ambos.',
    tip: 'Recuerda un número 2 con el pulgar insertado en el eje central.',
    fingers: { thumb: 0.7, index: 1.0, middle: 0.85, ring: 0.05, pinky: 0.05, spreadAngle: 0.4, rotationDeg: -10 }
  },
  {
    letter: 'L',
    name: 'Letra L',
    handshapeSummary: 'Índice vertical y pulgar horizontal formando un ángulo recto de 90°.',
    tip: 'Dibuja exactamente una L mayúscula vista de frente.',
    fingers: { thumb: 1.0, index: 1.0, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.7, rotationDeg: 0 }
  },
  {
    letter: 'M',
    name: 'Letra M',
    handshapeSummary: 'Índice, medio y anular extendidos juntos o apoyados sobre el pulgar.',
    tip: 'Tres dedos visibles representan los tres trazos verticales de la letra M.',
    fingers: { thumb: 0.2, index: 0.85, middle: 0.85, ring: 0.85, pinky: 0.05, spreadAngle: 0.15, rotationDeg: 0 }
  },
  {
    letter: 'N',
    name: 'Letra N',
    handshapeSummary: 'Índice y medio unidos sobre el pulgar (dos trazos verticales de la N).',
    tip: 'Similar a la M pero únicamente con dos dedos activos.',
    fingers: { thumb: 0.2, index: 0.8, middle: 0.8, ring: 0.05, pinky: 0.05, spreadAngle: 0.12, rotationDeg: 10 }
  },
  {
    letter: 'Ñ',
    name: 'Letra Ñ',
    handshapeSummary: 'Configuración de la letra N acompañada de un suave vaivén lateral de muñeca.',
    tip: 'El desplazamiento horizontal representa la virgulilla (~) característica del español.',
    fingers: { thumb: 0.2, index: 0.8, middle: 0.8, ring: 0.05, pinky: 0.05, spreadAngle: 0.12, rotationDeg: 12, motionType: 'tilde_wave' }
  },
  {
    letter: 'O',
    name: 'Letra O',
    handshapeSummary: 'Las yemas de todos los dedos se unen al pulgar formando un anillo circular.',
    tip: 'Asegúrate de que el hueco central de la O sea visible.',
    fingers: { thumb: 0.55, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.42, spreadAngle: 0.1, rotationDeg: -15 }
  },
  {
    letter: 'P',
    name: 'Letra P',
    handshapeSummary: 'Configuración K inclinada ligeramente o índice recto con dedos medios apoyados.',
    tip: 'Mantén la muñeca relajada para enlazar con la vocal siguiente.',
    fingers: { thumb: 0.6, index: 0.95, middle: 0.7, ring: 0.05, pinky: 0.05, spreadAngle: 0.3, rotationDeg: -28 }
  },
  {
    letter: 'Q',
    name: 'Letra Q',
    handshapeSummary: 'Pinza de índice y pulgar orientada hacia abajo.',
    tip: 'Es la misma configuración de la G pero apuntando hacia el suelo.',
    fingers: { thumb: 0.75, index: 0.75, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.3, rotationDeg: -115 }
  },
  {
    letter: 'R',
    name: 'Letra R',
    handshapeSummary: 'Dedo medio cruzado por encima del dedo índice, ambos estirados hacia arriba.',
    tip: 'Como el gesto tradicional de cruzar los dedos para desear buena suerte.',
    fingers: { thumb: 0.15, index: 0.95, middle: 0.95, ring: 0.05, pinky: 0.05, spreadAngle: 0.02, rotationDeg: 4 }
  },
  {
    letter: 'S',
    name: 'Letra S',
    handshapeSummary: 'Puño cerrado compacto con el pulgar cruzado por delante de los dedos.',
    tip: 'A diferencia de la A (pulgar al lado), en la S el pulgar abraza los dedos al frente.',
    fingers: { thumb: 0.25, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.05, rotationDeg: 0 }
  },
  {
    letter: 'T',
    name: 'Letra T',
    handshapeSummary: 'Puño cerrado con la punta del pulgar asomando entre el índice y el dedo medio.',
    tip: 'Mantén la palma orientada ligeramente en diagonal para mayor claridad.',
    fingers: { thumb: 0.45, index: 0.15, middle: 0.1, ring: 0.05, pinky: 0.05, spreadAngle: 0.1, rotationDeg: -8 }
  },
  {
    letter: 'U',
    name: 'Letra U',
    handshapeSummary: 'Índice y dedo medio completamente estirados y pegados entre sí en vertical.',
    tip: 'Si los separas se convierte en V; mantenlos totalmente unidos para la U.',
    fingers: { thumb: 0.15, index: 1.0, middle: 1.0, ring: 0.05, pinky: 0.05, spreadAngle: 0.06, rotationDeg: 0 }
  },
  {
    letter: 'V',
    name: 'Letra V',
    handshapeSummary: 'Índice y dedo medio estirados y separados formando una V.',
    tip: 'La separación angular dibuja claramente la letra V.',
    fingers: { thumb: 0.15, index: 1.0, middle: 1.0, ring: 0.05, pinky: 0.05, spreadAngle: 0.55, rotationDeg: 0 }
  },
  {
    letter: 'W',
    name: 'Letra W',
    handshapeSummary: 'Índice, medio y anular estirados y separados entre sí.',
    tip: 'Los tres dedos abiertos dibujan la silueta de la W.',
    fingers: { thumb: 0.15, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.05, spreadAngle: 0.55, rotationDeg: 0 }
  },
  {
    letter: 'X',
    name: 'Letra X',
    handshapeSummary: 'Dedo índice flexionado en forma de gancho; resto del puño cerrado.',
    tip: 'Mantén la primera articulación del índice curvada con firmeza.',
    fingers: { thumb: 0.15, index: 0.55, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.15, rotationDeg: -12 }
  },
  {
    letter: 'Y',
    name: 'Letra Y',
    handshapeSummary: 'Pulgar y meñique extendidos hacia los lados; índice, medio y anular plegados.',
    tip: 'Los dos extremos abiertos dibujan los brazos superiores de la Y.',
    fingers: { thumb: 1.0, index: 0.05, middle: 0.05, ring: 0.05, pinky: 1.0, spreadAngle: 0.85, rotationDeg: 0 }
  },
  {
    letter: 'Z',
    name: 'Letra Z',
    handshapeSummary: 'Con el dedo índice extendido se traza en el aire la figura quebrada de una Z.',
    tip: 'Traza tres líneas limpias: horizontal superior, diagonal descendente y base horizontal.',
    fingers: { thumb: 0.15, index: 1.0, middle: 0.05, ring: 0.05, pinky: 0.05, spreadAngle: 0.15, rotationDeg: -8, motionType: 'z_trace' }
  }
];

export const FINGERSPELLING_WORDS: FingerspellingWordItem[] = [
  // Nivel Inicial (3-4 letras, alta frecuencia)
  { id: 'fw-sol', word: 'SOL', clue: 'Estrella luminosa que da calor al día', category: 'Naturaleza', level: 'inicial' },
  { id: 'fw-mar', word: 'MAR', clue: 'Gran extensión de agua salada con olas', category: 'Naturaleza', level: 'inicial' },
  { id: 'fw-luz', word: 'LUZ', clue: 'Claridad esencial para comunicarnos en lengua de signos', category: 'Concepto Visual', level: 'inicial' },
  { id: 'fw-paz', word: 'PAZ', clue: 'Estado de tranquilidad, calma y armonía', category: 'Emociones', level: 'inicial' },
  { id: 'fw-hola', word: 'HOLA', clue: 'Saludo cotidiano al encontrarnos con alguien', category: 'Saludos', level: 'inicial' },
  { id: 'fw-casa', word: 'CASA', clue: 'Hogar o lugar donde vivimos con la familia', category: 'Cotidiano', level: 'inicial' },

  // Nivel Intermedio (5-6 letras)
  { id: 'fw-amiga', word: 'AMIGA', clue: 'Persona querida con quien compartes afecto y confianza', category: 'Vínculos', level: 'intermedio' },
  { id: 'fw-signo', word: 'SIGNO', clue: 'Unidad lingüística visual formada por las manos y el rostro', category: 'Lenguaje', level: 'intermedio' },
  { id: 'fw-manos', word: 'MANOS', clue: 'Articuladores principales de la lengua de signos', category: 'Anatomía', level: 'intermedio' },
  { id: 'fw-mirar', word: 'MIRAR', clue: 'Mantener el contacto visual atento durante la conversación', category: 'Gramática', level: 'intermedio' },
  { id: 'fw-feliz', word: 'FELIZ', clue: 'Sentimiento de alegría plena que se signa en el pecho', category: 'Emociones', level: 'intermedio' },

  // Nivel Avanzado (7-9 letras, incluye Ñ y combinaciones rápidas)
  { id: 'fw-empatia', word: 'EMPATIA', clue: 'Capacidad de comprender y conectar con los sentimientos ajenos', category: 'Valores', level: 'avanzado' },
  { id: 'fw-mañana', word: 'MAÑANA', clue: 'Tiempo futuro inmediato que se proyecta hacia adelante', category: 'Tiempo', level: 'avanzado' },
  { id: 'fw-dialogo', word: 'DIALOGO', clue: 'Conversación recíproca entre dos o más personas signantes', category: 'Comunicación', level: 'avanzado' },
  { id: 'fw-cultura', word: 'CULTura'.toUpperCase(), clue: 'Patrimonio, identidad e historia de la comunidad sorda', category: 'Comunidad', level: 'avanzado' }
];

export const GAMIFICATION_BADGES: GamificationBadge[] = [
  {
    id: 'badge-primer-paso',
    title: 'Primer Saludo',
    description: 'Completaste tu primera lección interactiva en vídeo con éxito.',
    xpReward: 50,
    category: 'lecciones',
    requirementLabel: 'Completar 1 lección'
  },
  {
    id: 'badge-expresion-viva',
    title: 'Rostro Expresivo',
    description: 'Superaste un ejercicio de reconocimiento facial con cámara en tiempo real.',
    xpReward: 75,
    category: 'facial',
    requirementLabel: 'Superar 1 reto facial'
  },
  {
    id: 'badge-dactilologa-inicial',
    title: 'Manos Ágiles',
    description: 'Adivinaste o deletreaste correctamente 3 palabras en el módulo de Dactilología.',
    xpReward: 80,
    category: 'deletreo',
    requirementLabel: '3 palabras en Deletreo Manual'
  },
  {
    id: 'badge-exploradora-glosario',
    title: 'Lexicógrafa Visual',
    description: 'Estudiaste y dominaste al menos 5 signos del Glosario Interactivo.',
    xpReward: 60,
    category: 'glosario',
    requirementLabel: 'Dominar 5 signos del glosario'
  },
  {
    id: 'badge-racha-constante',
    title: 'Constancia de Oro',
    description: 'Alcanzaste una racha de estudio de 3 o más días consecutivos.',
    xpReward: 100,
    category: 'constancia',
    requirementLabel: 'Racha de 3 días'
  },
  {
    id: 'badge-maestra-mnm',
    title: 'Maestra de Gramática Facial',
    description: 'Superaste los 4 retos de Marcadores No Manuales (MNM) en tiempo real.',
    xpReward: 150,
    category: 'facial',
    requirementLabel: 'Completar los 4 retos faciales'
  },
  {
    id: 'badge-experta-deletreo',
    title: 'Reina de la Dactilología',
    description: 'Alcanzaste el nivel adaptativo Avanzado o una racha de 5 aciertos seguidos en Deletreo.',
    xpReward: 150,
    category: 'deletreo',
    requirementLabel: 'Racha 5 en Deletreo o Nivel Avanzado'
  },
  {
    id: 'badge-graduada-signaviva',
    title: 'Comunicadora Integral',
    description: 'Completaste todas las lecciones del currículo desde Inicial hasta Avanzado.',
    xpReward: 250,
    category: 'lecciones',
    requirementLabel: 'Completar las 5 lecciones del curso'
  }
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarInitials: string;
  levelLabel: string;
  xpPoints: number;
  streakDays: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export const COMMUNITY_LEADERBOARD_BASE: LeaderboardEntry[] = [
  {
    id: 'peer-1',
    name: 'Sofía Navarro',
    avatarInitials: 'SN',
    levelLabel: 'Nivel Avanzado',
    xpPoints: 640,
    streakDays: 9,
    badgesCount: 6
  },
  {
    id: 'peer-2',
    name: 'Lucía Fernández',
    avatarInitials: 'LF',
    levelLabel: 'Nivel Intermedio',
    xpPoints: 485,
    streakDays: 6,
    badgesCount: 5
  },
  {
    id: 'peer-3',
    name: 'Mateo Ruiz',
    avatarInitials: 'MR',
    levelLabel: 'Nivel Intermedio',
    xpPoints: 340,
    streakDays: 4,
    badgesCount: 4
  },
  {
    id: 'peer-4',
    name: 'Elena Morales',
    avatarInitials: 'EM',
    levelLabel: 'Nivel Inicial',
    xpPoints: 210,
    streakDays: 2,
    badgesCount: 2
  }
];
