import { Lesson, FacialChallenge } from '../types/learning';

export const LESSONS_CURRICULUM: Lesson[] = [
  {
    id: 'lec-01-saludos',
    number: '01',
    title: 'Saludos Esenciales y Primer Contacto',
    subtitle: 'Aprende a saludar, presentarte y agradecer con naturalidad desde el primer día.',
    level: 'inicial',
    durationMinutes: 10,
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
      },
      {
        id: 'voc-por-favor',
        word: 'Por favor',
        phoneticVisual: 'Palma en pecho → círculo continuo',
        handshape: 'Palma abierta apoyada sobre el tórax',
        location: 'Centro del pecho',
        movement: 'Rotación circular en sentido horario dos veces',
        nonManualMarker: 'Cejas levemente elevadas con gesto amable de petición'
      },
      {
        id: 'voc-buenos-dias',
        word: 'Buenos días',
        phoneticVisual: 'Mano en barbilla → apertura solar en arco',
        handshape: 'Configuración plana que se abre hacia arriba',
        location: 'Mentón hacia espacio neutro superior',
        movement: 'Combinación de signo Bueno + apertura ascendente de Día',
        nonManualMarker: 'Expresión despierta y luminosa'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Posición inicial de saludo (Sien)',
        durationMs: 1400,
        leftHand: { x: 0.34, y: 0.72, rotation: -10, fingerSpread: 0.3, shapeLabel: 'Reposo neutro' },
        rightHand: { x: 0.61, y: 0.33, rotation: -22, fingerSpread: 0.9, shapeLabel: 'Mano B en sien' },
        eyebrowArch: 0.35,
        mouthOpen: 0.15,
        mouthSmile: 0.75,
        headTilt: 3,
        motionArrow: { fromX: 0.61, fromY: 0.33, toX: 0.74, toY: 0.30, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Extensión de "Hola" hacia afuera',
        durationMs: 1400,
        leftHand: { x: 0.34, y: 0.72, rotation: -10, fingerSpread: 0.3, shapeLabel: 'Reposo neutro' },
        rightHand: { x: 0.74, y: 0.30, rotation: 15, fingerSpread: 1.0, shapeLabel: 'Apertura cordial' },
        eyebrowArch: 0.45,
        mouthOpen: 0.25,
        mouthSmile: 0.9,
        headTilt: 5
      },
      {
        phaseLabel: 'Fase 3: Contacto en mentón para "Gracias"',
        durationMs: 1400,
        leftHand: { x: 0.35, y: 0.70, rotation: -8, fingerSpread: 0.4, shapeLabel: 'Base estable' },
        rightHand: { x: 0.52, y: 0.44, rotation: -5, fingerSpread: 0.85, shapeLabel: 'Yemas en mentón' },
        eyebrowArch: 0.2,
        mouthOpen: 0.1,
        mouthSmile: 0.8,
        headTilt: 0,
        motionArrow: { fromX: 0.52, fromY: 0.44, toX: 0.66, toY: 0.55, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 4: Proyección frontal de agradecimiento',
        durationMs: 1500,
        leftHand: { x: 0.35, y: 0.70, rotation: -8, fingerSpread: 0.4, shapeLabel: 'Base estable' },
        rightHand: { x: 0.66, y: 0.55, rotation: 25, fingerSpread: 0.95, shapeLabel: 'Entrega frontal' },
        eyebrowArch: 0.3,
        mouthOpen: 0.2,
        mouthSmile: 0.95,
        headTilt: -4
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
        explanation: 'El signo de "Gracias" inicia tocando suavemente el mentón con las yemas de la mano plana y se proyecta hacia el interlocutor.'
      },
      {
        id: 'q2-saludos',
        question: '¿Cuál es el componente no manual más importante al saludar o agradecer?',
        options: [
          'Mirar nuestras propias manos todo el tiempo',
          'Fruncir el ceño con firmeza',
          'Mantener contacto visual con el interlocutor y expresión facial acorde',
          'Cerrar los ojos mientras se mueve la mano'
        ],
        correctIndex: 2,
        explanation: 'En lengua de signos siempre se mantiene el contacto visual con la persona con quien hablamos; mirar las propias manos interrumpe la conexión comunicativa.'
      }
    ],
    offlineTips: [
      'Practica frente a un espejo durante 3 minutos diarios sin mirar tu mano directamente: fija la vista en tus propios ojos.',
      'Mantén los hombros relajados; el espacio de signado abarca desde la cintura hasta la parte superior de la cabeza.'
    ]
  },
  {
    id: 'lec-02-dactilologia',
    number: '02',
    title: 'Alfabeto Dactilológico y Deletreo Manual',
    subtitle: 'Domina las vocales y consonantes clave para deletrear nombres propios y lugares.',
    level: 'inicial',
    durationMinutes: 14,
    category: 'Dactilología',
    summary:
      'El alfabeto dactilológico representa las letras del abecedario mediante configuraciones manuales precisas. Se utiliza para nombres propios, direcciones o palabras cuyo signo específico aún no conoces.',
    learningObjectives: [
      'Articular con nitidez las 5 vocales (A, E, I, O, U) sin rebotar el brazo.',
      'Distinguir las configuraciones consonánticas estáticas de las que tienen desplazamiento (Ñ, LL, RR).',
      'Mantener la mano a la altura del hombro dominante con la palma orientada hacia el receptor.'
    ],
    biomechanics: {
      configuracionManual: 'Transición fluida entre puño con pulgar lateral (A), dedos curvados (E), meñique extendido (I), círculo digital (O) y pinza índice-medio (U).',
      ubicacionEspacial: 'Delante del hombro dominante, a unos 15 cm del torso, evitando tapar la boca.',
      trayectoriaMovimiento: 'Posición estable sin sacudidas; ligero desplazamiento lateral únicamente en letras dobles o con virgulilla.',
      marcadorFacial: 'Vocalización labial silenciosa y mirada atenta.'
    },
    targetFacialExpression: 'enfasis_labial',
    facialExercisePrompt: 'Articula suavemente las vocales con los labios (sin gritar) mientras mantienes las cejas relajadas y la mirada fija.',
    vocabulary: [
      {
        id: 'voc-letra-a',
        word: 'Letra A',
        phoneticVisual: 'Puño cerrado + pulgar extendido al costado',
        handshape: 'Configuración A (puño compacto, pulgar vertical pegado al índice)',
        location: 'Espacio neutro frente al hombro dominante',
        movement: 'Estático y firme',
        nonManualMarker: 'Labialización suave de "A"'
      },
      {
        id: 'voc-letra-e',
        word: 'Letra E',
        phoneticVisual: 'Dedos flexionados en garra suave',
        handshape: 'Yemas de los cinco dedos arqueadas hacia el centro de la palma',
        location: 'Espacio neutro frente al hombro',
        movement: 'Estático',
        nonManualMarker: 'Comisuras labiales retraídas suavemente ("E")'
      },
      {
        id: 'voc-letra-i',
        word: 'Letra I',
        phoneticVisual: 'Meñique vertical elevado',
        handshape: 'Puño cerrado con el dedo meñique completamente estirado hacia arriba',
        location: 'Espacio neutro lateral',
        movement: 'Estático (con giro de muñeca si pasa a J)',
        nonManualMarker: 'Atención visual neutra'
      },
      {
        id: 'voc-letra-o',
        word: 'Letra O',
        phoneticVisual: 'Todos los dedos unidos al pulgar formando un óvalo',
        handshape: 'Configuración O circular perfecta',
        location: 'Espacio neutro frente al hombro',
        movement: 'Estático',
        nonManualMarker: 'Redondeo labial "O"'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Vocal A: Puño firme con pulgar lateral',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo pasivo' },
        rightHand: { x: 0.64, y: 0.45, rotation: 0, fingerSpread: 0.15, shapeLabel: 'Configuración A' },
        eyebrowArch: 0.1,
        mouthOpen: 0.45,
        mouthSmile: 0.2,
        headTilt: 0
      },
      {
        phaseLabel: 'Vocal E: Dedos arqueados con precisión',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo pasivo' },
        rightHand: { x: 0.65, y: 0.45, rotation: 5, fingerSpread: 0.45, shapeLabel: 'Configuración E' },
        eyebrowArch: 0.15,
        mouthOpen: 0.25,
        mouthSmile: 0.5,
        headTilt: 2
      },
      {
        phaseLabel: 'Vocal I / O: Transición de meñique a óvalo digital',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo pasivo' },
        rightHand: { x: 0.66, y: 0.44, rotation: -5, fingerSpread: 0.35, shapeLabel: 'Configuración O' },
        eyebrowArch: 0.1,
        mouthOpen: 0.35,
        mouthSmile: 0.0,
        headTilt: 0
      },
      {
        phaseLabel: 'Vocal U: Índice y medio extendidos en V/U',
        durationMs: 1300,
        leftHand: { x: 0.32, y: 0.74, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo pasivo' },
        rightHand: { x: 0.64, y: 0.43, rotation: 0, fingerSpread: 0.65, shapeLabel: 'Configuración U' },
        eyebrowArch: 0.2,
        mouthOpen: 0.2,
        mouthSmile: 0.15,
        headTilt: -2
      }
    ],
    quiz: [
      {
        id: 'q1-dactilo',
        question: '¿Dónde debe colocarse la mano al deletrear un nombre con dactilología?',
        options: [
          'Justo delante de los labios para tapar la boca',
          'A la altura del hombro dominante en una posición estable y cómoda',
          'Por encima de la cabeza moviendo todo el brazo de izquierda a derecha',
          'Debajo de la mesa'
        ],
        correctIndex: 1,
        explanation: 'Colocar la mano frente al hombro dominante permite al interlocutor ver simultáneamente tu configuración manual y tu articulación labial sin fatigar el brazo.'
      },
      {
        id: 'q2-dactilo',
        question: '¿Cuándo es más apropiado recurrir al deletreo dactilológico?',
        options: [
          'Para absolutamente todas las palabras de una oración larga',
          'Para nombres propios, apellidos, siglas o términos técnicos sin signo establecido',
          'Nunca, está prohibido en lengua de signos',
          'Solo cuando hablamos de verbos en pasado'
        ],
        correctIndex: 1,
        explanation: 'La dactilología es una herramienta puente ideal para nombres propios, lugares específicos o para preguntar cómo se signa un concepto nuevo.'
      }
    ],
    offlineTips: [
      'Deletrea los nombres de 5 objetos que veas en tu habitación manteniendo el codo cerca del torso.',
      'Prioriza la claridad de cada letra sobre la velocidad: una cadencia constante se entiende mucho mejor que deletrear rápido con rebotes.'
    ]
  },
  {
    id: 'lec-03-preguntas-mnm',
    number: '03',
    title: 'Gramática Facial: Preguntas Sí/No vs. Qué/Dónde',
    subtitle: 'Descubre cómo tus cejas y la inclinación de tu cabeza transforman una afirmación en pregunta.',
    level: 'intermedio',
    durationMinutes: 16,
    category: 'Gramática Visual',
    summary:
      'En lengua de signos, los signos de interrogación "¿?" se dibujan en el rostro. Las preguntas cerradas (respuesta Sí/No) requieren elevar las cejas, mientras que las preguntas abiertas (Qué, Quién, Cómo, Dónde) exigen fruncir ligeramente el ceño.',
    learningObjectives: [
      'Diferenciar el marcador facial de interrogación cerrada (cejas arriba + cabeza levemente adelantada).',
      'Aplicar el marcador de interrogación abierta o pronominal (cejas juntas/fruncidas).',
      'Combinar el signo manual de "¿Qué?", "¿Dónde?" y "¿Cómo estás?" con su expresión gramatical exacta.'
    ],
    biomechanics: {
      configuracionManual: 'Ambas manos con palmas hacia arriba en apertura interrogativa (para Qué/Dónde) o índice señalando al receptor (Tú).',
      ubicacionEspacial: 'Espacio neutro medio frente al torso superior.',
      trayectoriaMovimiento: 'Oscilación lateral corta de muñecas acompañada de pausa final sostenida.',
      marcadorFacial: 'Cejas elevadas (preguntas Sí/No) o cejas fruncidas (preguntas Qué/Dónde/Cuándo).'
    },
    targetFacialExpression: 'cejas_elevadas_pregunta',
    facialExercisePrompt: 'Eleva las cejas con claridad e inclina suavemente la cabeza para formular una pregunta cerrada en lengua de signos.',
    vocabulary: [
      {
        id: 'voc-que',
        word: '¿Qué?',
        phoneticVisual: 'Palmas hacia arriba + oscilación lateral + ceño interrogativo',
        handshape: 'Manos semiabiertas con palmas hacia el techo',
        location: 'Espacio neutro frontal',
        movement: 'Vibración u oscilación horizontal corta',
        nonManualMarker: 'Cejas ligeramente fruncidas + inclinación de barbilla'
      },
      {
        id: 'voc-donde',
        word: '¿Dónde?',
        phoneticVisual: 'Índice extendido oscilando o palmas abiertas explorando',
        handshape: 'Dedo índice vertical o ambas manos abiertas',
        location: 'Altura del pecho',
        movement: 'Vaivén corto de lado a lado',
        nonManualMarker: 'Ceño contraído de búsqueda + mirada inquisitiva'
      },
      {
        id: 'voc-como-estas',
        word: '¿Cómo estás?',
        phoneticVisual: 'Palmas rozan pecho hacia arriba → pulgar arriba hacia interlocutor',
        handshape: 'Manos curvas pasando a configuración de bienestar',
        location: 'Torso hacia adelante',
        movement: 'Doble tiempo: estado + pregunta',
        nonManualMarker: 'Cejas elevadas invitando a la respuesta'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Oración declarativa neutra',
        durationMs: 1300,
        leftHand: { x: 0.36, y: 0.60, rotation: -15, fingerSpread: 0.7, shapeLabel: 'Palma abierta' },
        rightHand: { x: 0.64, y: 0.60, rotation: 15, fingerSpread: 0.7, shapeLabel: 'Palma abierta' },
        eyebrowArch: 0.0,
        mouthOpen: 0.1,
        mouthSmile: 0.2,
        headTilt: 0
      },
      {
        phaseLabel: 'Fase 2: Pregunta Sí/No (Cejas elevadas + inclinación)',
        durationMs: 1600,
        leftHand: { x: 0.35, y: 0.56, rotation: -20, fingerSpread: 0.85, shapeLabel: 'Interrogación' },
        rightHand: { x: 0.65, y: 0.56, rotation: 20, fingerSpread: 0.85, shapeLabel: 'Interrogación' },
        eyebrowArch: 0.9,
        mouthOpen: 0.25,
        mouthSmile: 0.3,
        headTilt: 8,
        motionArrow: { fromX: 0.65, fromY: 0.56, toX: 0.72, toY: 0.52, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 3: Pregunta Abierta ¿Qué / Dónde? (Ceño concentrado)',
        durationMs: 1600,
        leftHand: { x: 0.32, y: 0.58, rotation: -30, fingerSpread: 0.9, shapeLabel: '¿Qué / Dónde?' },
        rightHand: { x: 0.68, y: 0.58, rotation: 30, fingerSpread: 0.9, shapeLabel: '¿Qué / Dónde?' },
        eyebrowArch: -0.75,
        mouthOpen: 0.3,
        mouthSmile: -0.1,
        headTilt: -6,
        motionArrow: { fromX: 0.62, fromY: 0.58, toX: 0.72, toY: 0.58, type: 'linear' }
      }
    ],
    quiz: [
      {
        id: 'q1-mnm',
        question: 'Si quieres preguntar "¿Quieres café?" (una pregunta de respuesta Sí o No), ¿cómo deben estar tus cejas?',
        options: [
          'Totalmente inmóviles y sin expresión',
          'Elevadas hacia arriba acompañadas de una ligera inclinación de cabeza hacia adelante',
          'Fruncidas con gesto de enfado',
          'Guiñando un ojo continuamente'
        ],
        correctIndex: 1,
        explanation: 'Las preguntas totales (respuesta Sí/No) se marcan gramaticalmente elevando las cejas durante el signo interrogativo y sosteniendo la mirada al final.'
      },
      {
        id: 'q2-mnm',
        question: '¿Qué sucede si haces el signo manual de "¿Dónde?" con una expresión completamente neutra?',
        options: [
          'Se entiende exactamente igual',
          'Pierde fuerza gramatical y puede resultar ambiguo entre una afirmación y una pregunta',
          'Significa "Ayer"',
          'Se convierte en un saludo formal'
        ],
        correctIndex: 1,
        explanation: 'Los Marcadores No Manuales (MNM) no son simple decoración emotiva: cumplen la función sintáctica de la entonación en las lenguas orales.'
      }
    ],
    offlineTips: [
      'Frente a la cámara en la pestaña "Práctica Facial", alterna 5 veces entre pregunta cerrada (cejas arriba) y pregunta abierta (cejas juntas).',
      'Recuerda mantener el último signo de la pregunta medio segundo quieto en el aire mientras esperas la respuesta.'
    ]
  },
  {
    id: 'lec-04-emociones-familia',
    number: '04',
    title: 'Emociones, Empatía y Vínculos Familiares',
    subtitle: 'Comunica cómo te sientes y habla sobre tus amigos, familia y entorno cercano.',
    level: 'intermedio',
    durationMinutes: 15,
    category: 'Conversación Cotidiana',
    summary:
      'Expresar estados de ánimo y hablar de las personas que queremos requiere sincronizar el movimiento sobre el pecho con una expresividad facial congruente. Aprenderás los signos de Amiga, Familia, Feliz, Sorprendida y Tranquila.',
    learningObjectives: [
      'Signar vínculos afectivos (Amiga/o, Familia, Persona importante).',
      'Modular la intensidad de un sentimiento mediante la velocidad del movimiento y la expresión facial.',
      'Expresar sorpresa, alegría y empatía con precisión visual.'
    ],
    biomechanics: {
      configuracionManual: 'Índices entrelazados (Amiga/o) o manos abiertas que ascienden por el pecho (Feliz / Contento).',
      ubicacionEspacial: 'Zona pectoral (centro de las emociones) y espacio neutro compartido.',
      trayectoriaMovimiento: 'Doble enganche de índices para amistad; barrido ascendente para alegría; círculo colectivo para familia.',
      marcadorFacial: 'Congruencia afectiva: apertura ocular en sorpresa, sonrisa plena en alegría.'
    },
    targetFacialExpression: 'apertura_sorpresa',
    facialExercisePrompt: 'Abre la boca y eleva las cejas mostrando asombro positivo como cuando recibes una gran noticia de una amiga.',
    vocabulary: [
      {
        id: 'voc-amiga',
        word: 'Amiga / Amigo',
        phoneticVisual: 'Índices en gancho que se enlazan en ambos sentidos',
        handshape: 'Dedos índices curvados (Configuración X) o manos que se abrazan',
        location: 'Espacio neutro central',
        movement: 'Enganche recíproco dos veces invirtiendo cuál queda arriba',
        nonManualMarker: 'Sonrisa cómplice y mirada cercana'
      },
      {
        id: 'voc-feliz',
        word: 'Feliz / Contenta',
        phoneticVisual: 'Palmas rozan el pecho hacia arriba con energía',
        handshape: 'Manos abiertas relajadas (Configuración 5)',
        location: 'Parte superior del pecho',
        movement: 'Doble movimiento circular ascendente',
        nonManualMarker: 'Sonrisa radiante y pómulos elevados'
      },
      {
        id: 'voc-familia',
        word: 'Familia',
        phoneticVisual: 'Ambas manos en F trazan un círculo de unión',
        handshape: 'Índice y pulgar unidos en círculo (Configuración F)',
        location: 'Frente al torso, iniciando juntas y cerrando el círculo',
        movement: 'Arco simétrico envolvente hasta unir los meñiques',
        nonManualMarker: 'Expresión serena y acogedora'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Signo de "Amiga" (Unión central)',
        durationMs: 1400,
        leftHand: { x: 0.45, y: 0.56, rotation: 25, fingerSpread: 0.35, shapeLabel: 'Enlace izquierdo' },
        rightHand: { x: 0.55, y: 0.54, rotation: -25, fingerSpread: 0.35, shapeLabel: 'Enlace derecho' },
        eyebrowArch: 0.35,
        mouthOpen: 0.2,
        mouthSmile: 0.85,
        headTilt: 4
      },
      {
        phaseLabel: 'Fase 2: Signo de "Feliz" (Ascenso en el pecho)',
        durationMs: 1400,
        leftHand: { x: 0.40, y: 0.48, rotation: -12, fingerSpread: 0.9, shapeLabel: 'Ascenso vital' },
        rightHand: { x: 0.60, y: 0.48, rotation: 12, fingerSpread: 0.9, shapeLabel: 'Ascenso vital' },
        eyebrowArch: 0.55,
        mouthOpen: 0.35,
        mouthSmile: 0.95,
        headTilt: 0,
        motionArrow: { fromX: 0.60, fromY: 0.58, toX: 0.60, toY: 0.44, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 3: Expresión de Sorpresa / Asombro positivo',
        durationMs: 1500,
        leftHand: { x: 0.34, y: 0.46, rotation: -20, fingerSpread: 1.0, shapeLabel: 'Expansión' },
        rightHand: { x: 0.66, y: 0.46, rotation: 20, fingerSpread: 1.0, shapeLabel: 'Expansión' },
        eyebrowArch: 0.95,
        mouthOpen: 0.75,
        mouthSmile: 0.45,
        headTilt: -3
      }
    ],
    quiz: [
      {
        id: 'q1-emociones',
        question: '¿Cómo se expresa en lengua de signos la diferencia entre estar "contenta" y estar "inmensamente feliz"?',
        options: [
          'Deletreando la palabra M-U-Y antes del signo',
          'Aumentando la amplitud del gesto manual y la intensidad de la expresión facial y corporal',
          'Haciendo el signo de espaldas',
          'Usando únicamente la mano izquierda'
        ],
        correctIndex: 1,
        explanation: 'La gradación e intensidad adjetival en lengua de signos se incorpora directamente en la energía del movimiento y en la expresión facial (modulación).'
      }
    ],
    offlineTips: [
      'En lengua de signos, la zona del pecho concentra la mayoría de signos relacionados con emociones, sentimientos y estados internos.',
      'Practica contar una anécdota breve a tu reflejo cambiando claramente de expresión entre sorpresa, duda y alegría.'
    ]
  },
  {
    id: 'lec-05-estructura-sov',
    number: '05',
    title: 'Sintaxis Espacial, Tiempo y Estructura SOV',
    subtitle: 'Organiza oraciones completas usando la línea temporal del cuerpo y el orden Sujeto-Objeto-Verbo.',
    level: 'avanzado',
    durationMinutes: 18,
    category: 'Sintaxis y Fluidez',
    summary:
      'A diferencia del español hablado (Sujeto-Verbo-Objeto), la lengua de signos organiza la escena visualmente: primero situamos el Tiempo, luego el Lugar, después los participantes (Sujeto y Objeto) y finalmente la Acción (Verbo).',
    learningObjectives: [
      'Utilizar la línea temporal imaginaria: detrás del hombro (Pasado), frente al cuerpo (Presente) y hacia adelante (Futuro).',
      'Estructurar frases naturales como: "MAÑANA BIBLIOTECA MI AMIGA YO APRENDER SIGNOS".',
      'Emplear el espacio tridimensional para ubicar referentes y señalarlos (indexación) sin repetir su nombre.'
    ],
    biomechanics: {
      configuracionManual: 'Mano dominante traza arco temporal (atrás para Ayer, delante para Mañana) y establece loci espaciales a izquierda y derecha.',
      ubicacionEspacial: 'Eje sagital (hombro-frente) para el tiempo; eje horizontal frontal para ubicar personas o lugares.',
      trayectoriaMovimiento: 'Verbos direccionales que viajan desde el punto espacial del Sujeto hacia el punto del Receptor.',
      marcadorFacial: 'Elevación de cejas al establecer el tópico o marco temporal al inicio de la frase.'
    },
    targetFacialExpression: 'cejas_fruncidas_wh',
    facialExercisePrompt: 'Marca énfasis gramatical focalizando las cejas e inclinando levemente la cabeza al establecer un punto en el espacio.',
    vocabulary: [
      {
        id: 'voc-ayer-pasado',
        word: 'Ayer / Pasado',
        phoneticVisual: 'Pulgar o palma hacia atrás sobre el hombro',
        handshape: 'Mano abierta o pulgar extendido (Configuración A/5)',
        location: 'Hombro dominante hacia atrás',
        movement: 'Arco retrocediendo hacia la espalda',
        nonManualMarker: 'Ligera inclinación posterior de cabeza'
      },
      {
        id: 'voc-manana-futuro',
        word: 'Mañana / Futuro',
        phoneticVisual: 'Índice o palma desde mejilla en arco hacia el frente',
        handshape: 'Configuración L o palma abierta lateral',
        location: 'Lateral del rostro proyectándose hacia adelante',
        movement: 'Curva ascendente frontal',
        nonManualMarker: 'Mirada proyectada hacia el horizonte'
      },
      {
        id: 'voc-aprender',
        word: 'Aprender',
        phoneticVisual: 'Tomar información de la palma e integrarla en la frente',
        handshape: 'Mano plana base + mano activa que cierra sus yemas hacia la sien',
        location: 'De la palma no dominante hacia la frente',
        movement: 'Trayectoria ascendente de absorción mental',
        nonManualMarker: 'Asentimiento comprensivo'
      },
      {
        id: 'voc-ayudar-direccional',
        word: 'Te ayudo / Me ayudas',
        phoneticVisual: 'Puño con pulgar arriba apoyado en palma → viaja hacia quien recibe la ayuda',
        handshape: 'Mano A sobre palma abierta B',
        location: 'Del emisor al receptor (o viceversa)',
        movement: 'Desplazamiento direccional que conjuga sujeto y objeto',
        nonManualMarker: 'Dirección de la mirada hacia el referente espacial'
      }
    ],
    keyframes: [
      {
        phaseLabel: 'Fase 1: Marco Temporal (Futuro / Mañana hacia adelante)',
        durationMs: 1400,
        leftHand: { x: 0.34, y: 0.68, rotation: 0, fingerSpread: 0.4, shapeLabel: 'Referencia base' },
        rightHand: { x: 0.62, y: 0.38, rotation: -15, fingerSpread: 0.6, shapeLabel: 'Tiempo Futuro' },
        eyebrowArch: 0.6,
        mouthOpen: 0.2,
        mouthSmile: 0.25,
        headTilt: 5,
        motionArrow: { fromX: 0.56, fromY: 0.40, toX: 0.72, toY: 0.36, type: 'arc' }
      },
      {
        phaseLabel: 'Fase 2: Tomar conocimiento de la palma ("Aprender" inicio)',
        durationMs: 1400,
        leftHand: { x: 0.42, y: 0.60, rotation: 20, fingerSpread: 0.9, shapeLabel: 'Libro / Base' },
        rightHand: { x: 0.48, y: 0.54, rotation: -20, fingerSpread: 0.8, shapeLabel: 'Captar idea' },
        eyebrowArch: 0.2,
        mouthOpen: 0.15,
        mouthSmile: 0.4,
        headTilt: 0,
        motionArrow: { fromX: 0.48, fromY: 0.54, toX: 0.56, toY: 0.32, type: 'linear' }
      },
      {
        phaseLabel: 'Fase 3: Integrar en la frente ("Aprender" cierre)',
        durationMs: 1400,
        leftHand: { x: 0.42, y: 0.62, rotation: 15, fingerSpread: 0.85, shapeLabel: 'Base abierta' },
        rightHand: { x: 0.56, y: 0.32, rotation: -35, fingerSpread: 0.2, shapeLabel: 'Mente / Frente' },
        eyebrowArch: 0.4,
        mouthOpen: 0.1,
        mouthSmile: 0.65,
        headTilt: -3
      },
      {
        phaseLabel: 'Fase 4: Verbo direccional "Te ayudo" hacia el interlocutor',
        durationMs: 1500,
        leftHand: { x: 0.48, y: 0.56, rotation: 10, fingerSpread: 0.9, shapeLabel: 'Palma sostén' },
        rightHand: { x: 0.52, y: 0.52, rotation: 0, fingerSpread: 0.2, shapeLabel: 'Apoyo activo' },
        eyebrowArch: 0.35,
        mouthOpen: 0.2,
        mouthSmile: 0.75,
        headTilt: 4,
        motionArrow: { fromX: 0.48, fromY: 0.56, toX: 0.68, toY: 0.52, type: 'linear' }
      }
    ],
    quiz: [
      {
        id: 'q1-sov',
        question: '¿Cómo se ordena habitualmente la frase "Mañana estudiaré lengua de signos en casa" en estructura visual?',
        options: [
          'ESTUDIARÉ MAÑANA EN CASA LENGUA DE SIGNOS',
          'MAÑANA — CASA — LENGUA DE SIGNOS — YO ESTUDIAR (Tiempo + Lugar + Objeto + Verbo)',
          'LENGUA DE SIGNOS CASA AYER',
          'Deletreando cada palabra letra por letra'
        ],
        correctIndex: 1,
        explanation: 'En lengua de signos establecemos primero el marco temporal (Mañana) y espacial (Casa), luego el objeto temático y finalmente la acción verbal.'
      },
      {
        id: 'q2-sov',
        question: '¿Qué es un verbo direccional como "Ayudar", "Explicar" o "Preguntar"?',
        options: [
          'Un verbo cuyo movimiento cambia de dirección en el espacio para indicar quién realiza la acción y quién la recibe',
          'Un verbo que solo se puede hacer caminando',
          'Un verbo que no utiliza las manos',
          'Un verbo exclusivo para hablar del clima'
        ],
        correctIndex: 0,
        explanation: 'Los verbos direccionales modifican su punto de inicio y fin en el espacio tridimensional: si se mueve de mí hacia ti significa "Yo te ayudo"; si viene de ti hacia mí significa "Tú me ayudas".'
      }
    ],
    offlineTips: [
      'Imagina el espacio frente a ti como un escenario: ubica los conceptos antes de aplicarles la acción.',
      'Recuerda siempre colocar la marca de tiempo (Ayer, Hoy, Mañana) al principio de la oración para no tener que conjugar cada verbo.'
    ]
  }
];

export const FACIAL_CHALLENGES: FacialChallenge[] = [
  {
    id: 'fc-01-saludo-afectivo',
    title: 'Marcador de Saludo y Cortesía Afectiva',
    level: 'inicial',
    grammarFunction: 'Apertura de canal comunicativo y cortesía visual',
    targetExpression: 'sonrisa_afectiva',
    instruction:
      'Mira al centro de la cámara y realiza una sonrisa cálida y natural mientras acompañas con una leve inclinación de saludo.',
    linguisticContext:
      'Se utiliza al signar "Hola", "Gracias", "Encantada de conocerte" y "Bienvenida". Transmite receptividad y confirma que el canal visual está activo.',
    thresholds: {
      minMouthSmile: 0.42
    },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-02-pregunta-cerrada',
    title: 'Interrogación Cerrada (Respuesta Sí / No)',
    level: 'intermedio',
    grammarFunction: 'Marcador sintáctico de pregunta polar (¿Entiendes?, ¿Quieres?)',
    targetExpression: 'cejas_elevadas_pregunta',
    instruction:
      'Eleva ambas cejas claramente e inclina la cabeza ligeramente hacia adelante o al costado como esperando confirmación.',
    linguisticContext:
      'En lengua de signos, elevar las cejas convierte cualquier oración afirmativa ("Tú estudias hoy") en una pregunta cerrada ("¿Estudias hoy?").',
    thresholds: {
      minEyebrowArch: 0.38
    },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-03-pregunta-abierta-wh',
    title: 'Interrogación Abierta (¿Qué?, ¿Dónde?, ¿Cómo?)',
    level: 'intermedio',
    grammarFunction: 'Marcador sintáctico pronominal de información específica',
    targetExpression: 'cejas_fruncidas_wh',
    instruction:
      'Acerca o contrae suavemente el entrecejo (cejas bajas/concentradas) e inclina levemente el mentón con gesto inquisitivo.',
    linguisticContext:
      'Acompaña obligatoriamente a los signos interrogativos Qué, Quién, Cuándo, Dónde y Por qué. No expresa enojo, sino foco gramatical de pregunta abierta.',
    thresholds: {
      maxEyebrowArch: -0.25
    },
    holdSecondsRequired: 2.5
  },
  {
    id: 'fc-04-exclamacion-asombro',
    title: 'Modulación Intensiva y Sorpresa Visual',
    level: 'avanzado',
    grammarFunction: 'Superlativo visual y énfasis narrativo',
    targetExpression: 'apertura_sorpresa',
    instruction:
      'Eleva las cejas y abre la boca en forma de "O" expresiva para marcar asombro, magnitud o un giro importante en la historia.',
    linguisticContext:
      'En narraciones avanzadas y clasificadores, la apertura bucal y ocular sustituye a adverbios como " muchísimo", "increíblemente" o "de repente".',
    thresholds: {
      minEyebrowArch: 0.35,
      minMouthOpen: 0.42
    },
    holdSecondsRequired: 2.5
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
    description:
      'Manual de bolsillo con las 27 configuraciones del abecedario dactilológico, pautas posturales del hombro y ejercicios de deletreo sin conexión.',
    includedTopics: [
      'Tabla completa A–Z con descripción biomecánica de cada dedo',
      'Diferencia entre letras estáticas y letras con trayectoria (Ñ, LL, RR, Z)',
      '15 ejercicios prácticos de deletreo progresivo para practicar en casa'
    ]
  },
  {
    id: 'guide-gramatica-facial',
    title: 'Cuaderno de Gramática Facial y Marcadores No Manuales (MNM)',
    level: 'Nivel Intermedio',
    formatLabel: 'Documento HTML/Imprimible Offline',
    pagesEstimate: '5 secciones + tabla de referencia',
    description:
      'Referencia visual sobre cómo las cejas, la mirada, los labios y la inclinación de la cabeza estructuran las preguntas y emociones.',
    includedTopics: [
      'Mapa comparativo: Preguntas Sí/No (cejas elevadas) vs. Qué/Dónde (ceño concentrado)',
      'Vocalización y componentes labiales en lengua de signos',
      'Guía de práctica frente al espejo de 7 días'
    ]
  },
  {
    id: 'guide-conversacion-sov',
    title: 'Manual de Conversación Cotidiana y Estructura Espacial SOV',
    level: 'Nivel Avanzado',
    formatLabel: 'Documento HTML/Imprimible Offline',
    pagesEstimate: '6 secciones + diálogos completos',
    description:
      'Guía avanzada para construir frases fluidas usando la línea temporal (Pasado, Presente, Futuro), verbos direccionales y diálogos reales.',
    includedTopics: [
      'Fórmula visual: Tiempo + Lugar + Sujeto + Objeto + Verbo',
      '12 diálogos paso a paso (Cafetería, Estudio, Médicos, Presentaciones)',
      'Lista de verificación de fluidez y uso del espacio tridimensional'
    ]
  }
];
