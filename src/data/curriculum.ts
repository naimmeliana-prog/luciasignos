import { Lesson, FacialChallenge, GvaExamQuestion, LinguisticModule } from '../types/learning';

export const LESSONS_CURRICULUM: Lesson[] = [
  {
    id: 'lec-01-saludos',
    number: '01',
    title: 'Saludos Esenciales y Primer Contacto',
    subtitle: 'Aprende a saludar, presentarte y agradecer con naturalidad desde el primer día.',
    level: 'inicial',
    durationMinutes: 12,
    category: 'Fundamentos',
    summary:
      'En la lengua de signos, el contacto visual y la expresión facial amable son la base de toda conversación. En esta lección dominarás los saludos cotidianos y las fórmulas de cortesía indispensables.',
    learningObjectives: [
      'Ejecutar correctamente los signos de Hola, Buenos días, Gracias y Por favor.',
      'Mantener el contacto visual continuo mientras las manos articulan en el espacio neutro.',
      'Coordinar la sonrisa afectiva con el movimiento de salida desde el mentón.'
    ],
    biomechanics: {
      configuracionManual: 'Mano dominante abierta en configuración B (dedos juntos y extendidos, pulgar recogido o paralelo).',
      ubicacionEspacial: 'Inicio próximo a la sien (para Hola) o a la altura del mentón (para Gracias y Buenos días).',
      trayectoriaMovimiento: 'Movimiento rectilíneo suave hacia adelante y ligeramente hacia afuera en dirección al interlocutor.',
      marcadorFacial: 'Sonrisa cálida y mirada directa a los ojos del receptor.'
    },
    targetFacialExpression: 'sonrisa_afectiva',
    facialExercisePrompt: 'Sonríe con calidez manteniendo la cabeza erguida mientras realizas el gesto de saludo y agradecimiento.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-hola',
        word: 'Hola',
        phoneticVisual: 'Mano en sien → arco lateral abierto',
        handshape: 'Mano plana abierta (Configuración B)',
        location: 'Lateral de la frente / sien derecha',
        movement: 'Desplazamiento corto hacia afuera con giro suave de muñeca',
        nonManualMarker: 'Sonrisa cordial y elevación leve de cejas'
      },
      {
        id: 'voc-gracias',
        word: 'Gracias',
        phoneticVisual: 'Yemas en mentón → proyección frontal',
        handshape: 'Mano plana con dedos unidos',
        location: 'Barbilla / mentón',
        movement: 'Arco frontal descendente hacia el interlocutor',
        nonManualMarker: 'Sonrisa afectiva + inclinación suave de cabeza (asentimiento)'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Posición inicial de saludo en sien',
        durationMs: 1400,
        leftHand: { x: 0.34, y: 0.72, rotation: -10, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.61, y: 0.33, rotation: -22, fingerSpread: 0.9, shapeLabel: 'Sien' },
        eyebrowArch: 0.35,
        mouthOpen: 0.15,
        mouthSmile: 0.75,
        headTilt: 3,
        motionArrow: { fromX: 0.61, fromY: 0.33, toX: 0.74, toY: 0.30, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Extensión abierta hacia afuera',
        durationMs: 1400,
        leftHand: { x: 0.34, y: 0.72, rotation: -10, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.74, y: 0.30, rotation: 15, fingerSpread: 1.0, shapeLabel: 'Apertura' },
        eyebrowArch: 0.45,
        mouthOpen: 0.25,
        mouthSmile: 0.9,
        headTilt: 5
      }
    ],
    quiz: [
      {
        id: 'q1-saludos',
        question: '¿Desde qué punto del cuerpo parte el signo de "Gracias"?',
        options: [
          'Desde el centro de la frente hacia arriba',
          'Desde la barbilla o mentón proyectándose hacia adelante',
          'Desde el hombro izquierdo hacia el derecho',
          'Con ambas manos entrelazadas en la cintura'
        ],
        correctIndex: 1,
        explanation: 'El signo de "Gracias" inicia tocando suavemente el mentón con las yemas y se proyecta hacia el interlocutor.'
      }
    ],
    offlineTips: ['Practica frente al espejo durante 3 minutos diarios fijando la vista en tus propios ojos.']
  },
  {
    id: 'lec-02-dactilologia',
    number: '02',
    title: 'Alfabeto Dactilológico y Deletreo Manual',
    subtitle: 'Domina las vocales y consonantes clave para deletrear nombres propios y lugares.',
    level: 'inicial',
    durationMinutes: 15,
    category: 'Dactilología',
    summary:
      'El alfabeto dactilológico representa las letras del abecedario mediante configuraciones manuales precisas. Se utiliza para nombres propios, direcciones o palabras cuyo signo específico aún no conoces.',
    learningObjectives: [
      'Articular con nitidez las 5 vocales (A, E, I, O, U) sin rebotar el brazo.',
      'Distinguir las configuraciones consonánticas estáticas de las que tienen desplazamiento (Ñ, LL, RR).',
      'Mantener la mano a la altura del hombro dominante con la palma orientada hacia el receptor.'
    ],
    biomechanics: {
      configuracionManual: 'Transición fluida entre puño con pulgar lateral (A), dedos curvados (E), meñique extendido (I), círculo digital (O).',
      ubicacionEspacial: 'Delante del hombro dominante, a unos 15 cm del torso, evitando tapar la boca.',
      trayectoriaMovimiento: 'Posición estable sin sacudidas; ligero desplazamiento lateral únicamente en letras dobles.',
      marcadorFacial: 'Vocalización labial silenciosa y mirada atenta.'
    },
    targetFacialExpression: 'enfasis_labial',
    facialExercisePrompt: 'Articula suavemente las vocales con los labios sin gritar mientras mantienes las cejas relajadas.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-letra-a',
        word: 'Letra A',
        phoneticVisual: 'Puño cerrado + pulgar lateral',
        handshape: 'Configuración A',
        location: 'Espacio neutro frente al hombro',
        movement: 'Estático y firme',
        nonManualMarker: 'Labialización suave de A'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Configuración A',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo' },
        rightHand: { x: 0.64, y: 0.45, rotation: 0, fingerSpread: 0.15, shapeLabel: 'Letra A' },
        eyebrowArch: 0.1,
        mouthOpen: 0.45,
        mouthSmile: 0.2,
        headTilt: 0
      },
      {
        phaseLabel: 'Fase 2: Configuración E',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo' },
        rightHand: { x: 0.65, y: 0.45, rotation: 5, fingerSpread: 0.45, shapeLabel: 'Letra E' },
        eyebrowArch: 0.15,
        mouthOpen: 0.25,
        mouthSmile: 0.5,
        headTilt: 2
      }
    ],
    quiz: [
      {
        id: 'q1-dactilo',
        question: '¿Dónde debe colocarse la mano al deletrear un nombre con dactilología?',
        options: [
          'Justo delante de los labios tapando la boca',
          'A la altura del hombro dominante en una posición estable',
          'Por encima de la cabeza moviendo todo el brazo',
          'Debajo de la mesa'
        ],
        correctIndex: 1,
        explanation: 'Colocar la mano frente al hombro permite al interlocutor ver la configuración manual y la articulación labial simultáneamente.'
      }
    ],
    offlineTips: ['Deletrea los nombres de 5 objetos de tu entorno manteniendo el codo cerca del torso.']
  },
  {
    id: 'lec-03-familia',
    number: '03',
    title: 'Familia, Hogar y Vínculos Cercanos',
    subtitle: 'Expresa los lazos familiares, la casa y las personas de tu entorno.',
    level: 'inicial',
    durationMinutes: 14,
    category: 'Familia y Personas',
    summary:
      'La familia y el hogar ocupan un lugar central en la comunidad sorda. Aprenderás a signar los parentescos principales y la estructura del hogar utilizando clasificadores espaciales básicos.',
    learningObjectives: [
      'Signar correctamente Familia, Amiga, Madre, Padre y Casa.',
      'Utilizar el espacio neutro para ubicar a los miembros de la familia.',
      'Mantener la congruencia en la expresión facial de afecto.'
    ],
    biomechanics: {
      configuracionManual: 'Configuración F para familia; configuraciones planas B para casa.',
      ubicacionEspacial: 'Espacio neutro frontal a la altura del pecho.',
      trayectoriaMovimiento: 'Trazados circulares y simétricos.',
      marcadorFacial: 'Expresión cálida y acogedora.'
    },
    targetFacialExpression: 'sonrisa_afectiva',
    facialExercisePrompt: 'Sonríe con afecto al signar los miembros de tu familia.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-familia',
        word: 'Familia',
        phoneticVisual: 'Manos F unidas que trazan círculo envolvente',
        handshape: 'Configuración F',
        location: 'Espacio neutro frente al torso',
        movement: 'Arco circular simétrico',
        nonManualMarker: 'Expresión cálida'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Manos F unidas al centro',
        durationMs: 1200,
        leftHand: { x: 0.46, y: 0.55, rotation: 10, fingerSpread: 0.65, shapeLabel: 'Mano F' },
        rightHand: { x: 0.54, y: 0.55, rotation: -10, fingerSpread: 0.65, shapeLabel: 'Mano F' },
        eyebrowArch: 0.2,
        mouthOpen: 0.1,
        mouthSmile: 0.7,
        headTilt: 0,
        motionArrow: { fromX: 0.54, fromY: 0.55, toX: 0.68, toY: 0.62, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Círculo envolvente',
        durationMs: 1200,
        leftHand: { x: 0.36, y: 0.62, rotation: -20, fingerSpread: 0.65, shapeLabel: 'Arco izq' },
        rightHand: { x: 0.64, y: 0.62, rotation: 20, fingerSpread: 0.65, shapeLabel: 'Arco der' },
        eyebrowArch: 0.25,
        mouthOpen: 0.15,
        mouthSmile: 0.8,
        headTilt: 2
      }
    ],
    quiz: [
      {
        id: 'q-fam-1',
        question: '¿Qué configuración manual se utiliza habitualmente en el signo de "Familia"?',
        options: ['Configuración F', 'Configuración A', 'Puño cerrado', 'Índice estirado'],
        correctIndex: 0,
        explanation: 'El signo de familia se inicia uniendo el dedo índice y el pulgar de ambas manos en configuración F.'
      }
    ],
    offlineTips: ['Practica describiendo los miembros de tu familia en orden de edad en el espacio.']
  },
  {
    id: 'lec-04-cotidiano',
    number: '04',
    title: 'Vida Cotidiana, Comida y Ocio',
    subtitle: 'Vocabulario esencial para el día a día, agua, café y actividades de estudio.',
    level: 'intermedio',
    durationMinutes: 16,
    category: 'Vida Cotidiana',
    summary:
      'Expande tu vocabulario hacia situaciones cotidianas de cafetería, estudio y tiempo libre. Aprende a preguntar por necesidades inmediatas.',
    learningObjectives: [
      'Signar Agua, Café, Aprender y Entender con fluidez.',
      'Combinar nombres y verbos en orden sintáctico correcto.',
      'Aplicar la modulación facial adecuada en peticiones.'
    ],
    biomechanics: {
      configuracionManual: 'Configuraciones variadas (L, W, puños apilados).',
      ubicacionEspacial: 'Mentón y espacio neutro central.',
      trayectoriaMovimiento: 'Golpes suaves y rotaciones circulares.',
      marcadorFacial: 'Expresión comunicativa activa.'
    },
    targetFacialExpression: 'neutral_atento',
    facialExercisePrompt: 'Mantén una actitud receptiva y dinámica.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-agua',
        word: 'Agua',
        phoneticVisual: 'Doble toque en barbilla con mano en L',
        handshape: 'Configuración L / W',
        location: 'Lateral de la barbilla',
        movement: 'Doble toque',
        nonManualMarker: 'Labialización de agua'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Aproximación al mentón',
        durationMs: 1100,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.56, y: 0.45, rotation: -15, fingerSpread: 0.55, shapeLabel: 'Toque' },
        eyebrowArch: 0.2,
        mouthOpen: 0.35,
        mouthSmile: 0.3,
        headTilt: 2
      },
      {
        phaseLabel: 'Fase 2: Confirmación',
        durationMs: 1100,
        leftHand: { x: 0.34, y: 0.72, rotation: 0, fingerSpread: 0.3, shapeLabel: 'Reposo' },
        rightHand: { x: 0.53, y: 0.43, rotation: -22, fingerSpread: 0.55, shapeLabel: 'Toque 2' },
        eyebrowArch: 0.25,
        mouthOpen: 0.2,
        mouthSmile: 0.45,
        headTilt: 0
      }
    ],
    quiz: [
      {
        id: 'q-cot-1',
        question: '¿Dónde se realiza el signo de "Agua"?',
        options: ['En la sien', 'En el lateral de la barbilla con dos toques', 'En el centro del pecho', 'Sobre la cabeza'],
        correctIndex: 1,
        explanation: 'El signo de agua se articula tocando dos veces el lateral de la barbilla con los dedos.'
      }
    ],
    offlineTips: ['Pide un vaso de agua en un entorno simulado utilizando el signo correcto.']
  },
  {
    id: 'lec-05-gva-a1-a2',
    number: '05',
    title: 'Preparación Examen GVA (Niveles A1 - A2)',
    subtitle: 'Conoce la estructura oficial de las pruebas de acreditación de la Generalitat Valenciana.',
    level: 'gva_oficial',
    durationMinutes: 20,
    category: 'Exámenes GVA Oficiales',
    summary:
      'Las pruebas oficiales de la Generalitat Valenciana evalúan la competencia comunicativa en lengua de signos en situaciones cotidianas, personales y administrativas básicas.',
    learningObjectives: [
      'Familiarizarse con los bloques de comprensión visual y expresión en exámenes GVA A1/A2.',
      'Responder con precisión a preguntas sobre datos personales y entorno familiar.',
      'Dominar la signación de topónimos de la Comunidad Valenciana.'
    ],
    biomechanics: {
      configuracionManual: 'Precisión en numerales y vocabulario autonómico.',
      ubicacionEspacial: 'Espacio de signado frontal estricto.',
      trayectoriaMovimiento: 'Fluidez natural sin vacilaciones.',
      marcadorFacial: 'Congruencia total entre pregunta y respuesta.'
    },
    targetFacialExpression: 'neutral_atento',
    facialExercisePrompt: 'Mantén una expresión atenta y receptiva.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-cv',
        word: 'Comunidad Valenciana',
        phoneticVisual: 'Territorio + seña distintiva',
        handshape: 'Configuraciones V y C',
        location: 'Espacio neutro',
        movement: 'Trazado horizontal',
        nonManualMarker: 'Neutral'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Presentación personal GVA A2',
        durationMs: 1500,
        leftHand: { x: 0.35, y: 0.65, rotation: 0, fingerSpread: 0.4, shapeLabel: 'Reposo' },
        rightHand: { x: 0.62, y: 0.48, rotation: 10, fingerSpread: 0.8, shapeLabel: 'Presentación' },
        eyebrowArch: 0.2,
        mouthOpen: 0.2,
        mouthSmile: 0.6,
        headTilt: 2
      },
      {
        phaseLabel: 'Fase 2: Respuesta a preguntas',
        durationMs: 1500,
        leftHand: { x: 0.35, y: 0.65, rotation: 0, fingerSpread: 0.4, shapeLabel: 'Reposo' },
        rightHand: { x: 0.58, y: 0.45, rotation: -10, fingerSpread: 0.9, shapeLabel: 'Respuesta' },
        eyebrowArch: 0.3,
        mouthOpen: 0.15,
        mouthSmile: 0.7,
        headTilt: 0
      }
    ],
    quiz: [
      {
        id: 'gva-q1',
        question: 'En el examen GVA A2, ¿qué aspecto se valora especialmente en la prueba de expresión?',
        options: [
          'Hablar en voz alta de forma obligatoria',
          'La claridad de las configuraciones manuales y el respeto al espacio signado',
          'La velocidad extrema sin importar los signos',
          'El uso exclusivo de la mano izquierda'
        ],
        correctIndex: 1,
        explanation: 'Los tribunales de la GVA valoran la precisión queirológica, la ubicación espacial y el uso correcto de los marcadores no manuales.'
      }
    ],
    offlineTips: ['Practica simulacros de 5 minutos respondiendo preguntas sobre tu profesión y residencia.']
  },
  {
    id: 'lec-06-verbos-espaciales',
    number: '06',
    title: 'Verbos Direccionales y Espacio Tridimensional',
    subtitle: 'Domina los verbos espaciales que incorporan el sujeto y el objeto en su movimiento.',
    level: 'intermedio',
    durationMinutes: 18,
    category: 'Tiempo y Verbos',
    summary:
      'En LSE, los verbos direccionales (como Ayudar, Preguntar, Dar) modifican su trayectoria en el espacio tridimensional para indicar quién realiza la acción y quién la recibe sin necesidad de pronombres adicionales.',
    learningObjectives: [
      'Comprender la concordancia espacial en verbos direccionales.',
      'Articular correctamente el signo de Ayudar y Dar modulando el origen y el destino.',
      'Mantener la línea de la mirada alineada con el locus espacial.'
    ],
    biomechanics: {
      configuracionManual: 'Configuración A sobre palma B para Ayudar.',
      ubicacionEspacial: 'Espacio neutro con desplazamiento vectorial.',
      trayectoriaMovimiento: 'De emisor a receptor (o viceversa).',
      marcadorFacial: 'Expresión dirigida al interlocutor.'
    },
    targetFacialExpression: 'sonrisa_afectiva',
    facialExercisePrompt: 'Dirige tu mirada y expresión hacia el lugar donde se sitúa el receptor de la acción.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-ayudar',
        word: 'Ayudar',
        phoneticVisual: 'Puño A sobre palma B desplazándose hacia el receptor',
        handshape: 'Configuración A sobre B',
        location: 'Espacio neutro',
        movement: 'Direccional hacia el receptor',
        nonManualMarker: 'Disposición y mirada'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Inicio junto al cuerpo',
        durationMs: 1200,
        leftHand: { x: 0.46, y: 0.58, rotation: 10, fingerSpread: 0.9, shapeLabel: 'Palma' },
        rightHand: { x: 0.48, y: 0.53, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Ayuda' },
        eyebrowArch: 0.45,
        mouthOpen: 0.15,
        mouthSmile: 0.5,
        headTilt: 2,
        motionArrow: { fromX: 0.48, fromY: 0.55, toX: 0.68, toY: 0.52, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Proyección hacia adelante',
        durationMs: 1200,
        leftHand: { x: 0.62, y: 0.54, rotation: 14, fingerSpread: 0.9, shapeLabel: 'Receptor' },
        rightHand: { x: 0.65, y: 0.49, rotation: 5, fingerSpread: 0.2, shapeLabel: 'Destino' },
        eyebrowArch: 0.55,
        mouthOpen: 0.2,
        mouthSmile: 0.65,
        headTilt: 5
      }
    ],
    quiz: [
      {
        id: 'q-verb-1',
        question: '¿Qué caracteriza a un verbo direccional en lengua de signos?',
        options: [
          'Se hace siempre con las dos manos quietas',
          'Modifica su dirección de movimiento para indicar el sujeto y el objeto',
          'No requiere ningún marcador facial',
          'Se utiliza exclusivamente para los números'
        ],
        correctIndex: 1,
        explanation: 'Los verbos direccionales incorporan la concordancia sintáctica cambiando su punto de partida y destino en el espacio.'
      }
    ],
    offlineTips: ['Practica el verbo Ayudar indicando diferentes personas imaginarias en tu habitación.']
  },
  {
    id: 'lec-07-mnm-avanzados',
    number: '07',
    title: 'Marcadores No Manuales Avanzados y Subordinación',
    subtitle: 'El papel gramatical de las cejas, la cabeza y los hombros en oraciones complejas.',
    level: 'avanzado',
    durationMinutes: 22,
    category: 'Gramática y Sintaxis',
    summary:
      'En los niveles avanzados, los componentes no manuales (MNM) son obligatorios para marcar condicionales, concesivas, relativas y preguntas de información.',
    learningObjectives: [
      'Diferenciar el fruncimiento de cejas en preguntas WH frente a preguntas cerradas.',
      'Sostener marcadores no manuales durante cláusulas subordinadas enteras.',
      'Sincronizar la prosodia visual con el ritmo manual.'
    ],
    biomechanics: {
      configuracionManual: 'Independencia manual y fluidez en discursos complejos.',
      ubicacionEspacial: 'Espacio tridimensional completo.',
      trayectoriaMovimiento: 'Fluidez narrativa avanzada.',
      marcadorFacial: 'Control milimétrico de cejas, labios y hombros.'
    },
    targetFacialExpression: 'cejas_fruncidas_wh',
    facialExercisePrompt: 'Contrae suavemente el ceño manteniendo la concentración en la estructura de la pregunta WH.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-que',
        word: '¿Qué?',
        phoneticVisual: 'Palmas hacia arriba con oscilación y ceño fruncido',
        handshape: 'Palmas abiertas hacia arriba',
        location: 'Espacio neutro',
        movement: 'Vaivén lateral',
        nonManualMarker: 'Cejas fruncidas (WH)'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Apertura de palmas WH',
        durationMs: 1200,
        leftHand: { x: 0.36, y: 0.58, rotation: -20, fingerSpread: 0.85, shapeLabel: 'Palma izq' },
        rightHand: { x: 0.64, y: 0.58, rotation: 20, fingerSpread: 0.85, shapeLabel: 'Palma der' },
        eyebrowArch: -0.65,
        mouthOpen: 0.25,
        mouthSmile: 0.0,
        headTilt: -4,
        motionArrow: { fromX: 0.64, fromY: 0.58, toX: 0.72, toY: 0.58, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 2: Oscilación con ceño contraído',
        durationMs: 1200,
        leftHand: { x: 0.30, y: 0.58, rotation: -30, fingerSpread: 0.9, shapeLabel: 'Oscilación' },
        rightHand: { x: 0.70, y: 0.58, rotation: 30, fingerSpread: 0.9, shapeLabel: 'Oscilación' },
        eyebrowArch: -0.8,
        mouthOpen: 0.3,
        mouthSmile: -0.05,
        headTilt: 5
      }
    ],
    quiz: [
      {
        id: 'q-mnm-1',
        question: '¿Qué marcador no manual acompaña obligatoriamente a una pregunta del tipo "¿Dónde?" o "¿Qué?"?',
        options: [
          'Sonrisa amplia y alegre',
          'Fruncimiento o acercamiento de las cejas (marcador WH)',
          'Cerrar los ojos por completo',
          'Inclinación hacia atrás'
        ],
        correctIndex: 1,
        explanation: 'Las preguntas abiertas con pronombres interrogativos exigen el fruncimiento de cejas como marca gramatical sintáctica.'
      }
    ],
    offlineTips: ['Practica formulando 5 preguntas abiertas frente al espejo verificando el movimiento de tus cejas.']
  },
  {
    id: 'lec-08-gva-b1-b2',
    number: '08',
    title: 'Preparación Examen GVA (Niveles B1 - B2)',
    subtitle: 'Dominio de la fluidez argumentativa, registros formales y situaciones complejas.',
    level: 'gva_oficial',
    durationMinutes: 25,
    category: 'Exámenes GVA Oficiales',
    summary:
      'Los niveles B1 y B2 de la Generalitat Valenciana exigen narrar acontecimientos, expresar hipótesis, debatir sobre temas sociolaborales y utilizar clasificadores con soltura.',
    learningObjectives: [
      'Estructurar discursos coherentes utilizando conectores espaciales y temporales.',
      'Defender una postura argumental ante situaciones hipotéticas.',
      'Demostrar dominio en la prosodia visual avanzada.'
    ],
    biomechanics: {
      configuracionManual: 'Uso avanzado de clasificadores de tamaño, forma y movimiento.',
      ubicacionEspacial: 'Creación de loci múltiples en el espacio tridimensional.',
      trayectoriaMovimiento: 'Fluidez discursiva con cambios de registro.',
      marcadorFacial: 'Expresiones complejas de duda, énfasis y matización.'
    },
    targetFacialExpression: 'cejas_fruncidas_wh',
    facialExercisePrompt: 'Demuestra concentración y control prosódico al argumentar una propuesta.',
    realisticPhotoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    vocabulary: [
      {
        id: 'voc-b2-argumentar',
        word: 'Argumentar / Debatir',
        phoneticVisual: 'Intercambio de puntos de vista en el espacio',
        handshape: 'Configuración G / 5',
        location: 'Espacio neutro',
        movement: 'Movimiento alterno',
        nonManualMarker: 'Ceño concentrado'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Planteamiento de hipótesis B2',
        durationMs: 1400,
        leftHand: { x: 0.36, y: 0.58, rotation: -15, fingerSpread: 0.8, shapeLabel: 'Hipótesis A' },
        rightHand: { x: 0.64, y: 0.58, rotation: 15, fingerSpread: 0.8, shapeLabel: 'Hipótesis B' },
        eyebrowArch: -0.4,
        mouthOpen: 0.2,
        mouthSmile: 0.1,
        headTilt: -3
      },
      {
        phaseLabel: 'Fase 2: Conclusión argumentada',
        durationMs: 1400,
        leftHand: { x: 0.40, y: 0.55, rotation: 0, fingerSpread: 0.9, shapeLabel: 'Cierre A' },
        rightHand: { x: 0.60, y: 0.55, rotation: 0, fingerSpread: 0.9, shapeLabel: 'Cierre B' },
        eyebrowArch: 0.3,
        mouthOpen: 0.15,
        mouthSmile: 0.5,
        headTilt: 0
      }
    ],
    quiz: [
      {
        id: 'gva-b2-q1',
        question: '¿Qué son los clasificadores en el nivel B2 de lengua de signos?',
        options: [
          'Errores gramaticales',
          'Morfemas visuales que describen la forma, tamaño o movimiento de los objetos en el espacio',
          'Signos exclusivos para números',
          'Sinónimos de dactilología'
        ],
        correctIndex: 1,
        explanation: 'Los clasificadores son elementos altamente icónicos y gramaticales esenciales en los niveles B y C para describir la realidad.'
      }
    ],
    offlineTips: ['Grábate en vídeo exponiendo un tema de actualidad durante 3 minutos y revisa tus clasificadores.']
  }
];

export const FACIAL_CHALLENGES: FacialChallenge[] = [
  {
    id: 'fc-01-saludo-afectivo',
    title: 'Marcador de Saludo y Cortesía Afectiva',
    level: 'inicial',
    grammarFunction: 'Apertura de canal comunicativo y cortesía visual',
    targetExpression: 'sonrisa_afectiva',
    instruction: 'Mira al centro de la cámara y realiza una sonrisa cálida y natural acompañada de una leve inclinación.',
    linguisticContext: 'Se utiliza al signar "Hola", "Gracias", "Encantada" y "Bienvenida". Transmite receptividad.',
    thresholds: { minMouthSmile: 0.42 },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-02-pregunta-cerrada',
    title: 'Interrogación Cerrada (Respuesta Sí / No)',
    level: 'intermedio',
    grammarFunction: 'Marcador sintáctico de pregunta polar (¿Entiendes?, ¿Quieres?)',
    targetExpression: 'cejas_elevadas_pregunta',
    instruction: 'Eleva ambas cejas claramente e inclina la cabeza ligeramente hacia adelante esperando confirmación.',
    linguisticContext: 'Elevar las cejas convierte cualquier frase afirmativa en una pregunta cerrada.',
    thresholds: { minEyebrowArch: 0.38 },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-03-pregunta-abierta-wh',
    title: 'Interrogación Abierta (¿Qué?, ¿Dónde?, ¿Cómo?)',
    level: 'intermedio',
    grammarFunction: 'Marcador sintáctico pronominal de información específica',
    targetExpression: 'cejas_fruncidas_wh',
    instruction: 'Acerca o contrae suavemente el entrecejo con gesto inquisitivo.',
    linguisticContext: 'Acompaña obligatoriamente a los signos interrogativos Qué, Quién, Cuándo, Dónde y Por qué.',
    thresholds: { maxEyebrowArch: -0.25 },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-04-exclamacion-asombro',
    title: 'Modulación Intensiva y Sorpresa Visual',
    level: 'avanzado',
    grammarFunction: 'Superlativo visual y énfasis narrativo',
    targetExpression: 'apertura_sorpresa',
    instruction: 'Eleva las cejas y abre la boca en forma de "O" para marcar asombro o magnitud.',
    linguisticContext: 'Sustituye a adverbios como "muchísimo" o "increíblemente".',
    thresholds: { minEyebrowArch: 0.35, minMouthOpen: 0.42 },
    holdSecondsRequired: 2.5
  }
];

export const GVA_EXAM_BANK: GvaExamQuestion[] = [
  {
    id: 'gva-bank-1',
    level: 'A1',
    question: '¿Cómo se indica la negación básica en una frase en lengua de signos?',
    options: [
      'Cerrando los ojos con fuerza sin mover las manos',
      'Realizando el signo manual de NO acompañado de un movimiento horizontal de cabeza',
      'Levantando ambos brazos en vertical',
      'Deletreando la palabra N-E-G-A-R'
    ],
    correctIndex: 1,
    explanation: 'La negación requiere el signo manual de "No" con la oscilación horizontal de la cabeza.'
  },
  {
    id: 'gva-bank-2',
    level: 'A1',
    question: 'En la presentación personal básica en LSE, ¿qué se debe realizar en primer lugar?',
    options: [
      'Deletrear todo el historial médico',
      'Establecer contacto visual y signar el saludo inicial ("Hola")',
      'Dar la espalda al interlocutor',
      'Cantar en voz alta'
    ],
    correctIndex: 1,
    explanation: 'El contacto visual y el saludo inicial establecen el canal comunicativo adecuado en LSE.'
  },
  {
    id: 'gva-bank-3',
    level: 'A1',
    question: '¿Cuál es la orientación correcta de la palma al signar los números del 1 al 5?',
    options: [
      'Orientada hacia el propio pecho del emisor',
      'Orientada hacia el interlocutor (hacia afuera)',
      'Apuntando hacia el suelo',
      'Tapando los ojos'
    ],
    correctIndex: 1,
    explanation: 'Los numerales cardinales básicos se orientan con la palma hacia afuera para que sean legibles.'
  },
  {
    id: 'gva-bank-4',
    level: 'A1',
    question: '¿Qué componente no manual acompaña a las expresiones de cortesía como "Gracias"?',
    options: [
      'Ceño fruncido con agresividad',
      'Sonrisa afectiva y asentimiento suave de cabeza',
      'Cerrar los ojos con fuerza',
      'Inclinarse hacia atrás'
    ],
    correctIndex: 1,
    explanation: 'La cortesía en LSE exige una sonrisa afectiva y un asentimiento que refuerce el agradecimiento.'
  },
  {
    id: 'gva-bank-5',
    level: 'A2',
    question: 'En la estructura sintáctica básica de la LSE, ¿dónde suele colocarse el marcador temporal?',
    options: [
      'Siempre al final absoluto de la oración',
      'Al principio de la oración para establecer el marco temporal',
      'En medio del verbo principal',
      'No importa la posición'
    ],
    correctIndex: 1,
    explanation: 'La línea temporal se sitúa al inicio del enunciado para contextualizar toda la acción.'
  },
  {
    id: 'gva-bank-6',
    level: 'A2',
    question: 'Al deletrear un nombre propio con dactilología, ¿cómo deben colocarse los dedos?',
    options: [
      'Separados y agitados rápidamente hacia el suelo',
      'Estables, claros y ejecutados frente al hombro dominante sin rebotes de brazo',
      'Ocultos detrás del torso',
      'Tocando la nariz del receptor'
    ],
    correctIndex: 1,
    explanation: 'La dactilología exige claridad, estabilidad y posición frente al hombro dominante.'
  },
  {
    id: 'gva-bank-7',
    level: 'A2',
    question: '¿Cómo se indica la pluralidad en LSE cuando no se especifica un número exacto?',
    options: [
      'Repitiendo el signo mediante reduplicación o indicando cantidad en el espacio',
      'Escribiendo en un papel',
      'Gritando la palabra',
      'Utilizando exclusivamente la mano izquierda'
    ],
    correctIndex: 0,
    explanation: 'La reduplicación del signo o el uso de cuantificadores espaciales expresa el plural.'
  },
  {
    id: 'gva-bank-8',
    level: 'A2',
    question: '¿Qué distancia corporal y espacial es la recomendada al signar cara a cara?',
    options: [
      'Más de 5 metros de distancia',
      'La distancia natural de conversación interpersonal que permita ver manos y rostro',
      'Contacto físico constante en los hombros',
      'Detrás del interlocutor'
    ],
    correctIndex: 1,
    explanation: 'La distancia conversacional natural permite la visibilidad simultánea del espacio de signado y la expresión facial.'
  },
  {
    id: 'gva-bank-9',
    level: 'B1',
    question: '¿Qué diferencia un verbo plano de un verbo direccional o espacial?',
    options: [
      'Los verbos planos se hacen sentados y los direccionales de pie',
      'Los verbos direccionales modifican su trayectoria en el espacio para concordar con sujeto y objeto',
      'Los verbos planos no utilizan las manos',
      'No existe distinción'
    ],
    correctIndex: 1,
    explanation: 'Los verbos direccionales incorporan los roles sintácticos directamente en su trayectoria espacial.'
  },
  {
    id: 'gva-bank-10',
    level: 'B1',
    question: 'En una oración condicional en LSE (ej. "Si llueve, no voy"), ¿qué marcador no manual es obligatorio?',
    options: [
      'Elevación de cejas y ligera inclinación de cabeza en la prótesis condicional',
      'Cerrar los oídos',
      'Girar en círculos',
      'Ningún marcador'
    ],
    correctIndex: 0,
    explanation: 'La prótesis condicional se marca mediante la elevación de cejas y la inclinación de la cabeza.'
  },
  {
    id: 'gva-bank-11',
    level: 'B1',
    question: '¿Qué son los clasificadores descriptivos en lengua de signos?',
    options: [
      'Errores de articulación',
      'Configuraciones manuales que especifican la forma, tamaño y textura de los objetos',
      'Palabras en castellano escritas',
      'Sinónimos de números'
    ],
    correctIndex: 1,
    explanation: 'Los clasificadores descriptivos configuran visualmente el tamaño, la forma y la apariencia de elementos.'
  },
  {
    id: 'gva-bank-12',
    level: 'B1',
    question: '¿Cómo se marcan las oraciones subordinadas de relativo en el nivel B1 de LSE?',
    options: [
      'Con un parpadeo lento y ligera inclinación hacia atrás de la cabeza',
      'Gritando',
      'Bajando las manos al suelo',
      'No llevan marca visual'
    ],
    correctIndex: 0,
    explanation: 'Las relativas se acompañan de marcas no manuales específicas como la tensión cervical y elevación o flexión sutil.'
  },
  {
    id: 'gva-bank-13',
    level: 'B2',
    question: '¿Cuál es la función principal de los componentes no manuales (MNM) gramaticales?',
    options: [
      'Decorar la actuación artística',
      'Ejercer funciones equivalentes a entonación, modalidad oracional y cohesión sintáctica',
      'Sustituir por completo a las manos',
      'Indicar únicamente el estado de ánimo'
    ],
    correctIndex: 1,
    explanation: 'Los MNM gramaticales son obligatorios para marcar subordinación, interrogación y negaciones.'
  },
  {
    id: 'gva-bank-14',
    level: 'B2',
    question: 'En un debate formal o exposición argumentada (B2), ¿cómo se utiliza el espacio tridimensional?',
    options: [
      'Se ignoran los espacios',
      'Se establecen loci (puntos espaciales) persistentes para contraponer argumentos o personas',
      'Se signa únicamente con una mano pegada al cuerpo',
      'Se cambia de idioma constantemente'
    ],
    correctIndex: 1,
    explanation: 'La asignación de loci espaciales permite mantener la referencia discursiva de diferentes posturas y argumentos.'
  },
  {
    id: 'gva-bank-15',
    level: 'B2',
    question: '¿Qué exigencia prosódica se valora en la prueba de expresión del nivel B2 de la GVA?',
    options: [
      'La sincronía perfecta entre el ritmo manual, la modulación facial y el uso de clasificadores avanzados',
      'La velocidad sin importar la claridad',
      'La lectura labial en voz alta',
      'El uso exclusivo de dactilología'
    ],
    correctIndex: 0,
    explanation: 'El nivel B2 exige naturalidad, riqueza léxica y perfecta sincronía prosódico-visual.'
  },
  {
    id: 'gva-bank-16',
    level: 'B2',
    question: '¿Cómo se manejan los matices aspectuales (continuidad, reiteración, inceptividad) en los verbos de LSE?',
    options: [
      'Mediante la modificación temporal del movimiento, velocidad y reiteración del signo',
      'Con adjetivos en español',
      'Escribiendo notas',
      'No se pueden expresar'
    ],
    correctIndex: 0,
    explanation: 'Los aspectos verbales se modulan directamente alterando la cinética y la duración del movimiento signado.'
  }
];

export const LINGUISTIC_MODULES: LinguisticModule[] = [
  {
    id: 'ling-01-fonologia',
    title: 'Fonología de la LSE: Los Parámetros Formacionales',
    subtitle: 'Los 5 queremas que componen cada signo léxico.',
    category: 'Fonología',
    summary: 'Las lenguas de signos tienen parámetros formacionales (queremas) cuya alteración cambia el significado.',
    contentMarkdown: `
### Los Cinco Parámetros Formacionales (Stokoe / Klima & Bellugi)

1. **Configuración manual (Quierema)**: La forma que adopta la mano al ejecutar el signo.
2. **Lugar de articulación (Toponema)**: La zona del cuerpo o del espacio neutro donde se realiza.
3. **Movimiento (Kinema)**: La trayectoria, dirección o tipo de movimiento.
4. **Orientación**: Hacia dónde apunta la palma de la mano.
5. **Componente no manual (Prosodia visual)**: Expresión facial, movimientos de cabeza y cavidad bucal.
    `,
    keyTakeaways: ['Un cambio en un solo parámetro transforma por completo el significado del signo.']
  },
  {
    id: 'ling-02-morfosintaxis',
    title: 'Morfosintaxis y Orden Espacial SOV',
    subtitle: 'Por qué la LSE organiza el espacio de forma visual.',
    category: 'Morfosintaxis',
    summary: 'La LSE es una lengua viso-gestual que prioriza el orden Sujeto-Objeto-Verbo y la iconicidad espacial.',
    contentMarkdown: `
### Características Gramaticales Propias

- **Estructura Temática**: Se establece primero el Tópico y luego el Comentario.
- **Verbos de Acuerdo**: Incorporan concordancia de persona y número mediante la dirección espacial.
- **Ausencia de Cópula**: Artículos y verbos copulativos a menudo se integran en el ritmo visual y los clasificadores.
    `,
    keyTakeaways: ['La gramática visual aprovecha la tridimensionalidad del espacio para economizar relaciones sintácticas.']
  }
];

export interface OfflineResourceItem {
  id: string;
  title: string;
  level: string;
  formatLabel: string;
  pagesEstimate: string;
  description: string;
  includedTopics: string[];
}

export const OFFLINE_RESOURCES: OfflineResourceItem[] = [
  {
    id: 'guide-alfabeto-completo',
    title: 'Guía Ilustrada del Alfabeto Dactilológico y Números',
    level: 'Nivel Inicial',
    formatLabel: 'Documento HTML/Imprimible Offline',
    pagesEstimate: '4 secciones interactivas',
    description: 'Manual de bolsillo con las 27 configuraciones del abecedario dactilológico y ejercicios de deletreo.',
    includedTopics: ['Tabla completa A–Z con descripción biomecánica', 'Diferencia entre letras estáticas y dinámicas', '15 ejercicios de deletreo']
  },
  {
    id: 'guide-gramatica-facial',
    title: 'Cuaderno de Gramática Facial y Marcadores No Manuales (MNM)',
    level: 'Nivel Intermedio',
    formatLabel: 'Documento HTML/Imprimible Offline',
    pagesEstimate: '5 secciones',
    description: 'Referencia visual sobre cómo las cejas, la mirada y los labios estructuran las preguntas y emociones.',
    includedTopics: ['Mapa comparativo: Preguntas Sí/No vs. WH', 'Componentes labiales', 'Guía de práctica de 7 días']
  }
];
