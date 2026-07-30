// Base de datos de ejercicios con guía técnica completa
// type: 'reps' = por repeticiones | 'time' = por tiempo (segundos)
// Cada ejercicio incluye: description, steps[], tips[], difficulty y equipment
// para alimentar la ficha de detalle (ExerciseDetail).

export const EXERCISE_DB = [
  // === PECHO ===
  {
    id: "chest-1",
    image: "/images/exercises/chest-1.webp",
    name: "Press de Banca",
    muscle: "Pecho",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra y banco",
    description:
      "El ejercicio rey para el pecho. Empuje horizontal con barra que trabaja pectoral mayor, deltoides anterior y tríceps.",
    steps: [
      "Túmbate en el banco con los ojos bajo la barra y los pies firmes en el suelo.",
      "Agarra la barra algo más abierto que el ancho de hombros.",
      "Saca la barra del soporte y baja de forma controlada hasta tocar el medio del pecho.",
      "Empuja explosivo hacia arriba sin despegar los glúteos del banco.",
      "Mantén las escápulas retraídas y juntas durante toda la serie.",
    ],
    tips: [
      "No rebotes la barra en el pecho: controla la bajada en 2 segundos.",
      "Las muñecas rectas, directamente sobre los codos.",
      "Arquea ligeramente la zona lumbar para proteger el hombro.",
    ],
    icon: "M4 18h2v-2H4v2zm0-4h4v-2H4v2zm8 4h4v-2h-4v2zm-4-4h8v-2H8v2zm8 4h4v-2h-4v2zM2 12h20M2 12V8h3v4m0 0v4H2m20-4V8h-3v4m0 0v4h3",
  },
  {
    id: "chest-2",
    image: "/images/exercises/chest-2.webp",
    name: "Press Inclinado Mancuernas",
    muscle: "Pecho",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Mancuernas y banco inclinado",
    description:
      "Variante inclinada que enfatiza la porción superior del pectoral, con mayor recorrido que la barra.",
    steps: [
      "Ajusta el banco a una inclinación de 30-45°.",
      "Túmbate con una mancuerna en cada mano a la altura del pecho, palmas al frente.",
      "Empuja hacia arriba hasta casi juntar las mancuernas sobre el pecho.",
      "Baja lento hasta sentir el estiramiento en la parte alta del pecho.",
    ],
    tips: [
      "No choques las mancuernas arriba: mantén tensión constante.",
      "Inclinación de 30° para pecho; más de 45° recluta demasiado el hombro.",
    ],
    icon: "M7 17l3-8m4 8l3-8M6 20h2M14 20h2M8 9h2m4 0h2",
  },
  {
    id: "chest-3",
    image: "/images/exercises/chest-3.webp",
    name: "Aperturas con Mancuernas",
    muscle: "Pecho",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuernas y banco",
    description:
      "Ejercicio de aislamiento que estira y contrae el pectoral sin apenas ayuda del tríceps. Ideal para congestión y definición.",
    steps: [
      "Túmbate en banco plano con las mancuernas arriba, palmas enfrentadas.",
      "Con los codos ligeramente flexionados, abre los brazos en arco amplio.",
      "Baja hasta que las mancuernas queden a la altura del pecho.",
      "Vuelve a subir en arco, como si abrazaras un árbol grande.",
    ],
    tips: [
      "Usa menos peso del que crees: el estiramiento manda.",
      "El ángulo del codo se mantiene fijo durante todo el movimiento.",
    ],
    icon: "M5 12c0-3 2-5 7-5s7 2 7 5M8 7v4m8-4v4M6 14h12",
  },
  {
    id: "chest-4",
    image: "/images/exercises/chest-4.webp",
    name: "Fondos en Paralelas",
    muscle: "Pecho",
    type: "reps",
    difficulty: "Avanzado",
    equipment: "Peso corporal",
    description:
      "Empuje con peso corporal que machaca la porción inferior del pecho y los tríceps. Se puede lastrar con cinturón.",
    steps: [
      "Sujétate de las paralelas con los brazos extendidos y el cuerpo en alto.",
      "Inclina el torso ligeramente hacia adelante para enfocar el pecho.",
      "Baja flexionando los codos hasta que los hombros queden a la altura de los codos.",
      "Empuja con fuerza hasta extender los brazos sin bloquear los codos.",
    ],
    tips: [
      "Cuanto más vertical vayas, más trabaja el tríceps; más inclinado, más pecho.",
      "Evita bajar demasiado si sientes molestia en el hombro.",
    ],
    icon: "M8 4v16M16 4v16M8 8h-3M16 8h3M10 12h4",
  },
  {
    id: "chest-5",
    image: "/images/exercises/chest-5.webp",
    name: "Press Declinado",
    muscle: "Pecho",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra y banco declinado",
    description:
      "Empuje en declive que concentra el trabajo en la porción inferior del pectoral y permite mover más peso.",
    steps: [
      "Asegura las piernas en los soportes del banco declinado.",
      "Saca la barra y colócala sobre la parte baja del pecho.",
      "Baja controlado hasta rozar el pecho inferior.",
      "Empuja vertical hacia arriba hasta extender los brazos.",
    ],
    tips: [
      "Trayectoria más corta que en plano: cuida el control en la bajada.",
      "Ideal al final de la sesión de pecho como ejercicio de carga.",
    ],
    icon: "M2 14h20M4 14V10h3v4m10 0V10h3v4M9 14v4m6-4v4",
  },

  // === ESPALDA ===
  {
    id: "back-1",
    image: "/images/exercises/back-1.webp",
    name: "Dominadas",
    muscle: "Espalda",
    type: "reps",
    difficulty: "Avanzado",
    equipment: "Barra fija",
    description:
      "El mejor constructor de dorsales con peso corporal. Trabaja toda la espalda, bíceps y antebrazos.",
    steps: [
      "Cuelga de la barra con agarre prono algo más abierto que los hombros.",
      "Activa la escápula llevando los hombros hacia abajo antes de tirar.",
      "Tira del pecho hacia la barra llevando los codos hacia las caderas.",
      "Sube hasta que la barbilla supere la barra.",
      "Baja lento hasta extender casi por completo los brazos.",
    ],
    tips: [
      "No uses balanceo: si necesitas impulso, haz negativas o usa banda.",
      "Imagina que doblas la barra hacia abajo con las manos.",
    ],
    icon: "M4 4h16M8 4v4c0 2 1 4 4 4s4-2 4-4V4M12 12v6m-3 2h6",
  },
  {
    id: "back-2",
    image: "/images/exercises/back-2.webp",
    name: "Remo con Barra",
    muscle: "Espalda",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra",
    description:
      "Constructor de grosor de espalda por excelencia: dorsales, romboides y trapecios medios en un solo tirón.",
    steps: [
      "Con la barra en el suelo, inclínate con la espalda recta a unos 45°.",
      "Agarra la barra a la anchura de hombros, rodillas semiflexionadas.",
      "Tira de la barra hacia el ombligo llevando los codos atrás.",
      "Aprieta las escápulas un segundo arriba y baja controlado.",
    ],
    tips: [
      "La espalda nunca se redondea: pecho afuera y core firme.",
      "Tira con los codos, no con las manos: la barra es un gancho.",
    ],
    icon: "M4 16l4-8 4 4 4-4 4 8M2 16h20M8 16v3m8-3v3",
  },
  {
    id: "back-3",
    image: "/images/exercises/back-3.webp",
    name: "Jalón al Pecho",
    muscle: "Espalda",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Polea",
    description:
      "La alternativa en máquina a las dominadas. Perfecto para aprender el patrón de tracción vertical y ganar amplitud de dorsal.",
    steps: [
      "Siéntate con los muslos fijos bajo los rodillos y agarra la barra ancho.",
      "Inclina ligeramente el torso atrás y saca el pecho.",
      "Tira de la barra hasta la parte alta del pecho llevando los codos abajo.",
      "Vuelve lento hasta estirar bien los dorsales arriba.",
    ],
    tips: [
      "No tires detrás de la nuca: sobrecarga el hombro sin beneficio.",
      "Controla la subida: la fase excéntrica construye músculo.",
    ],
    icon: "M4 2h16M12 2v6M8 8l4 4 4-4M8 14h8M12 14v6",
  },
  {
    id: "back-4",
    image: "/images/exercises/back-4.webp",
    name: "Remo con Mancuerna",
    muscle: "Espalda",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuerna y banco",
    description:
      "Remo unilateral con apoyo que permite gran recorrido y corrige desequilibrios entre lados.",
    steps: [
      "Apoya una mano y la rodilla del mismo lado sobre el banco.",
      "Con la espalda paralela al suelo, cuelga la mancuerna del brazo libre.",
      "Tira de la mancuerna hacia la cadera, no hacia el pecho.",
      "Aprieta el dorsal arriba y baja hasta estirar por completo.",
    ],
    tips: [
      "El torso no rota: si giras el cuerpo, el peso es excesivo.",
      "Lleva el codo pegado al cuerpo para máximo trabajo de dorsal.",
    ],
    icon: "M6 18V8l6-4v14M18 10v4h-4",
  },
  {
    id: "back-5",
    image: "/images/exercises/back-5.webp",
    name: "Peso Muerto",
    muscle: "Espalda",
    type: "reps",
    difficulty: "Avanzado",
    equipment: "Barra",
    description:
      "El movimiento más completo del gimnasio: espalda baja, glúteos, isquios, trapecios y agarre. Fuerza total del cuerpo posterior.",
    steps: [
      "Pies al ancho de cadera, barra sobre el medio del pie, casi tocando las espinillas.",
      "Agarra la barra por fuera de las rodillas con la espalda neutra.",
      "Empuja el suelo con las piernas mientras extiendes cadera y rodillas a la vez.",
      "Termina de pie, con la cadera bloqueada, sin hiperextender la lumbar.",
      "Baja deslizando la barra pegada a las piernas, cadera primero.",
    ],
    tips: [
      "La barra viaja en línea vertical pegada al cuerpo todo el recorrido.",
      "Aprende con poco peso: la técnica es sagrada en este ejercicio.",
      "Aprieta los dorsales como si exprimieras naranjas en las axilas.",
    ],
    icon: "M2 18h20M6 18v-6l6-6 6 6v6M10 12h4",
  },

  // === HOMBRO ===
  {
    id: "shoulder-1",
    image: "/images/exercises/shoulder-1.webp",
    name: "Press Militar",
    muscle: "Hombro",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra",
    description:
      "Empuje vertical por excelencia para construir hombros completos y fuerza funcional de tren superior.",
    steps: [
      "De pie, barra a la altura de las clavículas, agarre algo más abierto que hombros.",
      "Aprieta glúteos y abdomen para estabilizar el tronco.",
      "Empuja la barra vertical echando ligeramente la cabeza atrás al inicio.",
      "Termina con la barra sobre la coronilla y los brazos extendidos.",
      "Baja controlado a las clavículas.",
    ],
    tips: [
      "No arquees la lumbar: si lo haces, baja el peso.",
      "La barra sube en línea recta; la cabeza se aparta y vuelve.",
    ],
    icon: "M12 20v-8m0 0l-4 4m4-4l4 4M6 8h12M6 8V6h2v2m8 0V6h2v2",
  },
  {
    id: "shoulder-2",
    image: "/images/exercises/shoulder-2.webp",
    name: "Elevaciones Laterales",
    muscle: "Hombro",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    description:
      "Aislamiento del deltoides lateral: el responsable de la anchura y la forma redondeada del hombro.",
    steps: [
      "De pie, mancuernas a los lados con codos ligeramente flexionados.",
      "Eleva los brazos hacia los lados hasta la altura de los hombros.",
      "Lidera el movimiento con los codos, no con las manos.",
      "Baja lento resistiendo todo el recorrido.",
    ],
    tips: [
      "Inclina las mancuernas como si sirvieras agua para proteger el hombro.",
      "Poco peso y técnica perfecta: el deltoides lateral se fatiga rápido.",
    ],
    icon: "M12 8v10M12 8l-6 6M12 8l6 6M9 20h6M10 6a2 2 0 104 0",
  },
  {
    id: "shoulder-3",
    image: "/images/exercises/shoulder-3.webp",
    name: "Elevaciones Frontales",
    muscle: "Hombro",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    description:
      "Trabajo directo del deltoides anterior, la parte frontal del hombro que da presencia de frente.",
    steps: [
      "De pie, mancuernas al frente de los muslos, palmas hacia ti.",
      "Eleva un brazo (o ambos) al frente hasta la altura de los ojos.",
      "Mantén el brazo casi extendido, sin balancear el tronco.",
      "Baja en 2-3 segundos hasta la posición inicial.",
    ],
    tips: [
      "Alterna brazos para mantener la tensión y el control.",
      "Si ya haces mucho press, úsalo con moderación: el deltoides frontal recibe mucho trabajo indirecto.",
    ],
    icon: "M12 8v10m-3 2h6M12 8l-4-4M12 8l4-4M10 6a2 2 0 104 0",
  },
  {
    id: "shoulder-4",
    image: "/images/exercises/shoulder-4.webp",
    name: "Pájaros (Rear Delt Fly)",
    muscle: "Hombro",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Mancuernas",
    description:
      "El ejercicio clave para el deltoides posterior: mejora la postura, la salud del hombro y la vista de espaldas.",
    steps: [
      "Inclínate con la espalda recta (o apoya el pecho en banco inclinado).",
      "Con las mancuernas colgando, palmas enfrentadas.",
      "Abre los brazos hacia los lados en arco hasta la línea de los hombros.",
      "Aprieta entre las escápulas arriba y baja lento.",
    ],
    tips: [
      "Peso ligero: es un músculo pequeño que se aisla mejor con control.",
      "Imagina juntar los omóplatos al final del movimiento.",
    ],
    icon: "M12 10v8M6 10c0-2 3-4 6-4s6 2 6 4M6 10l-2 4m16-4l2 4",
  },

  // === BÍCEPS ===
  {
    id: "bicep-1",
    image: "/images/exercises/bicep-1.webp",
    name: "Curl de Bíceps con Barra",
    muscle: "Bíceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Barra",
    description:
      "El constructor clásico de bíceps. Permite cargar pesado y estimular ambas cabezas del músculo.",
    steps: [
      "De pie, barra colgando con agarre supino a la anchura de hombros.",
      "Codos pegados a los costados, sube la barra flexionando los brazos.",
      "Contrae fuerte arriba sin llevar los codos hacia adelante.",
      "Baja lento hasta casi extender por completo.",
    ],
    tips: [
      "Nada de balanceo: si necesitas impulso, quita peso.",
      "La barra Z reduce la tensión en las muñecas.",
    ],
    icon: "M4 16h16M8 16v-6a4 4 0 018 0v6M10 10h4",
  },
  {
    id: "bicep-2",
    image: "/images/exercises/bicep-2.webp",
    name: "Curl Martillo",
    muscle: "Bíceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuernas",
    description:
      "Curl con agarre neutro que enfatiza el braquial y el braquiorradial: da grosor al brazo y fuerza al antebrazo.",
    steps: [
      "De pie, mancuernas a los lados con las palmas mirándose entre sí.",
      "Sube las mancuernas manteniendo el agarre neutro, como un martillo.",
      "Aprieta arriba un instante sin mover los codos.",
      "Baja controlado hasta la posición inicial.",
    ],
    tips: [
      "Puedes alternar brazos o subir ambos a la vez.",
      "Excelente como segundo ejercicio de bíceps tras el curl con barra.",
    ],
    icon: "M10 18v-8l-2-4M14 18v-8l2-4M8 6h2m4 0h2",
  },
  {
    id: "bicep-3",
    image: "/images/exercises/bicep-3.webp",
    name: "Curl Inclinado",
    muscle: "Bíceps",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Mancuernas y banco inclinado",
    description:
      "Al realizarlo en banco inclinado, el bíceps se estira al máximo: estímulo brutal para la cabeza larga.",
    steps: [
      "Túmbate en un banco a 45-60° con las mancuernas colgando.",
      "Deja los brazos caer atrás sintiendo el estiramiento del bíceps.",
      "Flexiona sin adelantar los codos.",
      "Baja lento hasta el estiramiento completo.",
    ],
    tips: [
      "Usa menos peso del habitual: la posición estirada es muy exigente.",
      "No muevas los hombros: solo se flexiona el codo.",
    ],
    icon: "M6 20l4-12 2 4 2-4 4 12M10 8a2 2 0 104 0",
  },
  {
    id: "bicep-4",
    image: "/images/exercises/bicep-4.webp",
    name: "Curl Concentrado",
    muscle: "Bíceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuerna",
    description:
      "Curl con el codo apoyado en el muslo que elimina todo trampo. Máxima conexión mente-músculo y pico de contracción.",
    steps: [
      "Siéntate, apoya el codo en la cara interna del muslo.",
      "Con la mancuerna colgando, flexiona hasta el hombro.",
      "Gira la muñeca (supina) al subir para máxima contracción.",
      "Baja muy lento sintiendo el bíceps trabajar.",
    ],
    tips: [
      "Ejercicio de bombeo: peso moderado y reps lentas.",
      "Perfecto para terminar la sesión de brazo.",
    ],
    icon: "M8 20v-6l4-6 4 6v6M10 14h4M12 8V6",
  },

  // === TRÍCEPS ===
  {
    id: "tricep-1",
    image: "/images/exercises/tricep-1.webp",
    name: "Extensión Tríceps Polea",
    muscle: "Tríceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Polea",
    description:
      "Extensión en polea alta con tensión constante: el básico para dar forma a la herradura del tríceps.",
    steps: [
      "De pie frente a la polea alta, agarra la barra o cuerda.",
      "Codos pegados al cuerpo, antebrazos paralelos al suelo.",
      "Extiende los brazos hacia abajo hasta bloquear el tríceps.",
      "Vuelve lento sin dejar que los codos se separen del torso.",
    ],
    tips: [
      "Con cuerda puedes separar las manos abajo para más contracción.",
      "El hombro no se mueve: solo trabaja el codo.",
    ],
    icon: "M12 4v8M8 12l4 4 4-4M8 18h8M12 16v4",
  },
  {
    id: "tricep-2",
    image: "/images/exercises/tricep-2.webp",
    name: "Press Francés",
    muscle: "Tríceps",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra Z",
    description:
      "Extensión tumbado con la barra sobre la frente: gran estiramiento de la cabeza larga del tríceps.",
    steps: [
      "Túmbate en banco con la barra extendida sobre el pecho.",
      "Baja la barra hacia la frente flexionando solo los codos.",
      "Los brazos superiores quedan fijos, ligeramente inclinados atrás.",
      "Extiende con fuerza sin mover los hombros.",
    ],
    tips: [
      "Codos apuntando al techo, nunca abiertos hacia fuera.",
      "Usa barra Z para mayor comodidad de muñecas.",
    ],
    icon: "M4 10h16M8 10V6h8v4M12 10v8M8 18h8",
  },
  {
    id: "tricep-3",
    image: "/images/exercises/tricep-3.webp",
    name: "Fondos en Banco",
    muscle: "Tríceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Banco",
    description:
      "Fondos con peso corporal apoyando las manos en un banco. Accesible en cualquier lugar y duro si se hace bien.",
    steps: [
      "Apoya las manos en el borde del banco, dedos al frente.",
      "Piernas extendidas delante, talones en el suelo.",
      "Baja el cuerpo flexionando los codos hasta unos 90°.",
      "Empuja con los tríceps hasta casi extender.",
    ],
    tips: [
      "Mantén la espalda cerca del banco durante la bajada.",
      "Eleva los pies sobre otro banco para más dificultad.",
    ],
    icon: "M4 8h6m4 0h6M10 8v10M14 8v10M6 18h4m4 0h4",
  },
  {
    id: "tricep-4",
    image: "/images/exercises/tricep-4.webp",
    name: "Patada de Tríceps",
    muscle: "Tríceps",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Mancuerna",
    description:
      "Extensión atrás con mancuerna inclinado: gran aislamiento y pico de contracción en la parte alta del recorrido.",
    steps: [
      "Inclínate con la espalda recta, codo pegado al costado y alto.",
      "El antebrazo cuelga vertical con la mancuerna.",
      "Extiende el brazo hacia atrás hasta que quede horizontal.",
      "Aprieta el tríceps un segundo y vuelve lento.",
    ],
    tips: [
      "Peso ligero: el objetivo es la contracción, no la carga.",
      "El brazo superior permanece inmóvil durante toda la serie.",
    ],
    icon: "M6 12h6l4-4M6 12v6m6-6v6M16 8l2-2",
  },

  // === PIERNA ===
  {
    id: "leg-1",
    image: "/images/exercises/leg-1.webp",
    name: "Sentadilla Libre",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra y rack",
    description:
      "El rey de las piernas: cuádriceps, glúteos y core en el movimiento más funcional que existe.",
    steps: [
      "Coloca la barra sobre los trapecios (no sobre el cuello) y sácala del rack.",
      "Pies al ancho de hombros, puntas ligeramente abiertas.",
      "Baja llevando la cadera atrás y abajo, como sentarte en una silla.",
      "Rompe el paralelo (cadera bajo la rodilla) con el pecho alto.",
      "Sube empujando el suelo con todo el pie.",
    ],
    tips: [
      "Las rodillas siguen la dirección de las puntas de los pies.",
      "Respira hondo abajo, suelta al pasar el punto difícil.",
      "Mirada al frente y pecho orgulloso en todo momento.",
    ],
    icon: "M12 4v4M8 8h8M8 8l-2 8h2l4-4 4 4h2l-2-8",
  },
  {
    id: "leg-2",
    image: "/images/exercises/leg-2.webp",
    name: "Prensa de Piernas",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Máquina",
    description:
      "Empuje de piernas guiado que permite mover mucho peso con seguridad, sin cargar la columna.",
    steps: [
      "Siéntate con la espalda y cadera bien apoyadas en el respaldo.",
      "Pies en la plataforma al ancho de hombros.",
      "Baja la plataforma controlado hasta unos 90° de flexión de rodilla.",
      "Empuja sin bloquear las rodillas arriba del todo.",
    ],
    tips: [
      "Pies más altos: más glúteo e isquio; más bajos: más cuádriceps.",
      "No despegues la cadera del asiento al bajar.",
    ],
    icon: "M4 18h16l-4-12H8L4 18zM8 12h8",
  },
  {
    id: "leg-3",
    image: "/images/exercises/leg-3.webp",
    name: "Extensión de Cuádriceps",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Máquina",
    description:
      "Aislamiento total del cuádriceps sentado: perfecto para congestión final y definición del teardrop.",
    steps: [
      "Ajusta el respaldo para que la rodilla quede alineada con el eje de la máquina.",
      "El rodillo se apoya sobre la parte baja de las espinillas.",
      "Extiende las piernas hasta quedar casi rectas.",
      "Aprieta el cuádriceps arriba un segundo y baja lento.",
    ],
    tips: [
      "Controla la bajada: es donde más se construye.",
      "No uses impulso: sube con el músculo, no con inercia.",
    ],
    icon: "M8 6v8l4 4 4-4V6M10 14h4M12 18v2",
  },
  {
    id: "leg-4",
    image: "/images/exercises/leg-4.webp",
    name: "Curl Femoral",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Máquina",
    description:
      "El aislador de isquiotibiales: clave para rodillas sanas y una parte posterior de pierna completa.",
    steps: [
      "Túmbate boca abajo con el rodillo sobre los talones.",
      "Agarra los soportes y mantén las caderas pegadas al banco.",
      "Flexiona las rodillas llevando los talones hacia los glúteos.",
      "Baja lento hasta casi extender.",
    ],
    tips: [
      "No levantes las caderas al subir: roba trabajo al isquio.",
      "Haz una pausa arriba en cada repetición.",
    ],
    icon: "M8 4v6l4 4 4-4V4M8 14v6m8-6v6",
  },
  {
    id: "leg-5",
    image: "/images/exercises/leg-5.webp",
    name: "Zancadas",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Mancuernas o peso corporal",
    description:
      "Trabajo unilateral que desarrolla cuádriceps y glúteos mientras mejora equilibrio y simetría entre piernas.",
    steps: [
      "De pie, da un paso largo hacia adelante.",
      "Baja la rodilla trasera hacia el suelo, sin tocarlo.",
      "La rodilla delantera no sobrepasa en exceso la punta del pie.",
      "Empuja con la pierna adelantada para volver o pasar a la siguiente.",
    ],
    tips: [
      "Torso erguido y mirada al frente para mantener el equilibrio.",
      "Empieza sin peso hasta dominar el patrón.",
    ],
    icon: "M8 4v6l-4 10M16 4v6l4 10M10 10h4",
  },
  {
    id: "leg-6",
    image: "/images/exercises/leg-6.webp",
    name: "Hip Thrust",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Barra y banco",
    description:
      "El mejor constructor de glúteos del gimnasio. Extensión de cadera con la espalda alta apoyada en un banco.",
    steps: [
      "Apoya la parte alta de la espalda en el borde del banco.",
      "Barra (con protector) sobre la cadera, pies firmes al ancho de cadera.",
      "Empuja la cadera hacia arriba hasta alinear rodillas, cadera y hombros.",
      "Aprieta los glúteos fuerte un segundo arriba.",
      "Baja controlado sin tocar el suelo con la cadera.",
    ],
    tips: [
      "Mentón ligeramente recogido y mirada al frente.",
      "Las espinillas quedan verticales en la posición alta.",
    ],
    icon: "M2 16h20M6 16v-4l6-4 6 4v4M12 8V6",
  },
  {
    id: "leg-7",
    image: "/images/exercises/leg-7.webp",
    name: "Elevación de Gemelos",
    muscle: "Pierna",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Máquina o peso corporal",
    description:
      "Extensión de tobillos para gemelos y sóleo. Recorrido completo y pausa: así crecen los gemelos.",
    steps: [
      "Coloca las puntas de los pies sobre un escalón o la plataforma de la máquina.",
      "Baja los talones lo máximo posible estirando el gemelo.",
      "Sube sobre las puntas lo más alto que puedas.",
      "Pausa de un segundo arriba y baja lento.",
    ],
    tips: [
      "Nada de rebotes: el gemelo responde al control y al estiramiento.",
      "Con rodillas flexionadas trabajas más el sóleo.",
    ],
    icon: "M8 4v12M16 4v12M8 16c0 2 2 4 4 4s4-2 4-4",
  },

  // === CORE ===
  {
    id: "core-1",
    image: "/images/exercises/core-1.webp",
    name: "Crunch Abdominal",
    muscle: "Core",
    type: "reps",
    difficulty: "Principiante",
    equipment: "Peso corporal",
    description:
      "El básico del recto abdominal: flexión de tronco corta y controlada, sin tirar del cuello.",
    steps: [
      "Túmbate boca arriba, rodillas flexionadas y pies en el suelo.",
      "Manos junto a las sienes, sin entrelazar detrás de la nuca.",
      "Eleva hombros y parte alta de la espalda contrayendo el abdomen.",
      "Baja lento sin relajar del todo el core.",
    ],
    tips: [
      "Exhala al subir y mete el ombligo hacia dentro.",
      "El cuello va neutro: la barbilla no toca el pecho.",
    ],
    icon: "M6 18c0-4 2-6 6-6s6 2 6 6M8 12l4-6 4 6",
  },
  {
    id: "core-2",
    image: "/images/exercises/core-2.webp",
    name: "Plancha",
    muscle: "Core",
    type: "time",
    difficulty: "Principiante",
    equipment: "Peso corporal",
    description:
      "Isométrico total del core: abdomen, lumbar y glúteos trabajando juntos para estabilizar el cuerpo.",
    steps: [
      "Apoya antebrazos y puntas de los pies en el suelo.",
      "Alinea cabeza, espalda, cadera y tobillos en línea recta.",
      "Aprieta abdomen y glúteos activamente.",
      "Respira con normalidad mientras mantienes la posición.",
    ],
    tips: [
      "No dejes caer la cadera ni la subas en pico.",
      "Calidad antes que tiempo: 30s perfectos valen más que 2 min malos.",
    ],
    icon: "M2 14h20M4 14l2-6h12l2 6",
  },
  {
    id: "core-3",
    image: "/images/exercises/core-3.webp",
    name: "Russian Twist",
    muscle: "Core",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Peso corporal o disco",
    description:
      "Rotación de tronco sentado que machaca los oblicuos. Con disco o mancuerna sube la intensidad.",
    steps: [
      "Siéntate con las rodillas flexionadas y los talones apoyados (o elevados).",
      "Inclina el torso atrás unos 45° manteniendo la espalda recta.",
      "Gira el tronco llevando las manos de un lado al otro.",
      "Controla el movimiento: gira el pecho, no solo los brazos.",
    ],
    tips: [
      "Si la lumbar molesta, apoya los talones en el suelo.",
      "Exhala en cada giro para activar más los oblicuos.",
    ],
    icon: "M12 8v8M8 12h8M6 16l6-8 6 8",
  },
  {
    id: "core-4",
    image: "/images/exercises/core-4.webp",
    name: "Elevación de Piernas",
    muscle: "Core",
    type: "reps",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    description:
      "Trabajo intenso de la porción inferior del abdomen elevando las piernas tumbado o colgado.",
    steps: [
      "Túmbate boca arriba con las manos bajo los glúteos o a los lados.",
      "Piernas extendidas, elévalas hasta la vertical.",
      "Baja lento sin que los talones toquen el suelo.",
      "Mantén la lumbar pegada al suelo en todo momento.",
    ],
    tips: [
      "Si se arquea la lumbar, flexiona ligeramente las rodillas.",
      "Versión avanzada: colgado de una barra.",
    ],
    icon: "M12 4v8M12 12l-4 6m4-6l4 6M10 4h4",
  },
  {
    id: "core-5",
    image: "/images/exercises/core-5.webp",
    name: "Plancha Lateral",
    muscle: "Core",
    type: "time",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    description:
      "Isométrico lateral que fortalece oblicuos y estabilizadores de la cadera. Equilibrio de core en estado puro.",
    steps: [
      "Túmbate de lado, antebrazo apoyado bajo el hombro.",
      "Eleva la cadera hasta alinear cabeza, tronco y piernas.",
      "Brazo libre extendido hacia el techo o en la cadera.",
      "Mantén sin dejar caer la cadera y cambia de lado.",
    ],
    tips: [
      "Apila cadera sobre cadera: no rotes el torso.",
      "Versión fácil: apoya la rodilla inferior en el suelo.",
    ],
    icon: "M4 18l8-4 8 4M12 14V6",
  },
  {
    id: "core-6",
    image: "/images/exercises/core-6.webp",
    name: "Mountain Climbers",
    muscle: "Core",
    type: "time",
    difficulty: "Intermedio",
    equipment: "Peso corporal",
    description:
      "Core dinámico con componente cardiovascular: abdomen y frecuencia cardíaca por las nubes al mismo tiempo.",
    steps: [
      "Posición de plancha alta con las manos bajo los hombros.",
      "Lleva una rodilla hacia el pecho y alterna con la otra de forma dinámica.",
      "Mantén la cadera baja y estable durante todo el ejercicio.",
      "Respira de forma rítmica al ritmo del movimiento.",
    ],
    tips: [
      "No conviertas el ejercicio en saltos: las puntas rozan el suelo.",
      "Acelera solo cuando la técnica sea perfecta.",
    ],
    icon: "M4 16l4-8 4 4 4-4 4 8",
  },

  // === CARDIO ===
  {
    id: "cardio-1",
    image: "/images/exercises/cardio-1.webp",
    name: "Cinta de Correr",
    muscle: "Cardio",
    type: "time",
    difficulty: "Principiante",
    equipment: "Máquina",
    description:
      "Cardio clásico controlable: caminata, trote o carrera con registro exacto de ritmo, distancia e inclinación.",
    steps: [
      "Sube con la cinta parada y ajusta velocidad e inclinación iniciales.",
      "Empieza caminando 3-5 minutos como calentamiento.",
      "Aumenta al ritmo objetivo manteniendo zancada natural.",
      "Termina bajando el ritmo progresivamente.",
    ],
    tips: [
      "No te agarres de los pasamanos: reduce el gasto calórico.",
      "Inclinación del 1-2% simula mejor la carrera en exterior.",
    ],
    icon: "M2 18h20M6 18V10l4-4 4 4 4-4v8",
  },
  {
    id: "cardio-2",
    image: "/images/exercises/cardio-2.webp",
    name: "Bicicleta Estática",
    muscle: "Cardio",
    type: "time",
    difficulty: "Principiante",
    equipment: "Máquina",
    description:
      "Cardio sin impacto articular: ideal para calentar, quemar calorías o recuperación activa de piernas.",
    steps: [
      "Ajusta el sillín a la altura de tu cadera de pie.",
      "Pedalea 5 minutos suaves para calentar.",
      "Sube la resistencia hasta un ritmo exigente pero sostenible.",
      "Mantén una cadencia fluida de 80-90 pedaladas por minuto.",
    ],
    tips: [
      "La rodilla queda ligeramente flexionada en el punto bajo del pedal.",
      "No balancees el tronco: el esfuerzo es de las piernas.",
    ],
    icon: "M8 18a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8zM8 14l4-8h4",
  },
  // Foto: "Womens Fitness Equipment Skipping Rope" (CC BY 2.0) — flickr.com/photos/lululemonathletica
  {
    id: "cardio-3",
    image: "/images/exercises/cardio-3.webp",
    name: "Saltos de Cuerda",
    muscle: "Cardio",
    type: "time",
    difficulty: "Intermedio",
    equipment: "Cuerda",
    description:
      "Cardio de alta intensidad con material mínimo: quema brutal, coordinación y gemelos de acero.",
    steps: [
      "Ajusta la cuerda: pisándola, los extremos llegan a las axilas.",
      "Salta bajo, unos 2-3 cm, sobre las puntas de los pies.",
      "Gira la cuerda con las muñecas, no con los brazos enteros.",
      "Mantén un ritmo constante y el core activo.",
    ],
    tips: [
      "Empieza con bloques de 30 segundos y ve sumando.",
      "Superficie con algo de amortiguación cuida tus articulaciones.",
    ],
    icon: "M8 4c-2 4-2 8 0 12m8-12c2 4 2 8 0 12M12 4v16",
  },
];

export const MUSCLE_GROUPS = [
  "Todos",
  "Pecho",
  "Espalda",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Pierna",
  "Core",
  "Cardio",
];

export const MUSCLE_COLORS = {
  Pecho: "#ef4444",
  Espalda: "#3b82f6",
  Hombro: "#f59e0b",
  Bíceps: "#8b5cf6",
  Tríceps: "#ec4899",
  Pierna: "#06b6d4",
  Core: "#10b981",
  Cardio: "#f97316",
};

// Colores de las insignias de dificultad
export const DIFFICULTY_COLORS = {
  Principiante: "#10b981",
  Intermedio: "#f59e0b",
  Avanzado: "#ef4444",
};
