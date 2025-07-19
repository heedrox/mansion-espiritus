const { theEndingScene, anUnlockingAction, aPickingAction, aRoom, anItem, aLockedDestination, aCondDescUsage, aCondDesc, anUsage, aConditionalResponse } = require('scure').dsl;

exports.data = {
  sentences: {
    help: 'Puedes darme las siguientes instrucciones: Mirar, Usar, Ir, Coger e Inventario. ¿Qué quieres hacer ahora?',
    fallback: 'No entiendo esa instrucción. Di Ayuda si necesitas asistencia. ¿Qué quieres hacer?',
    destinations: 'Desde aquí puedo ir a: {destinations}. ¿Dónde quieres que vaya?',
    'destination-unknown': 'No conozco el lugar {destination}. ¿Qué quieres hacer?',
    'item-not-in-location': 'No veo ese objeto aquí. ¿Qué quieres hacer?',
    'item-pickedup': 'He cogido el objeto {name}. ¿Qué quieres hacer?',
    'item-notpickable': 'No puedo llevarme el objeto {name}. ¿Qué quieres hacer?',
    'use-noarg': 'Dime qué objeto u objetos quieres que use. ¿Qué quieres hacer?',
    'use-cant': 'No puedo usar {item}. ¿Qué quieres hacer?',
    'use-canttwo': 'No puedo usar {item1} con {item2}. ¿Qué quieres hacer?',
    inventory: 'Llevo conmigo: {items}. ¿Qué quieres hacer?',
    'inventory-nothing': 'No llevo nada conmigo. ¿Qué quieres hacer?',
    bye: 'Hasta pronto, aventurero.',
    'end-timeover': 'Se acabó el tiempo. La aventura termina aquí.',
    'final-question': '¿Qué hacemos ahora?',
  },
  init: {
    totalMinutes: 60,
    roomId: 'torre-mago',
    welcome: [
      '¡Saludos aventurero! Soy Dron Johnson, tu dron mágico asistente. Has quedado atrapado en una torre encantada y sólo puedes interactuar conmigo para escapar. ¿Qué quieres hacer primero?',
    ],
  },
  rooms: [
    aRoom('torre-mago', 'Torre del Mago', ['torre'], [
      'Estoy en la Torre del Mago. Aquí veo una mesa con objetos, un arcón cerrado con candado y un viejo libro abierto sobre un atril.',
      aCondDesc('unlocked:open-arcon', 'El arcón está abierto y vacío.'),
    ]),
    aRoom('cripta-subterranea', 'Cripta Subterránea', ['cripta'], [
      'Estoy en la Cripta Subterránea. Hay un pedestal con una ranura extraña y una puerta cerrada con símbolos mágicos.',
      aCondDesc('unlocked:cripta-abierta', 'La puerta está abierta, revelando un pasaje hacia la libertad.'),
    ]),
  ],
  map: {
    'torre-mago': [aLockedDestination('cripta-subterranea', 'cripta-key')],
    'cripta-subterranea': ['torre-mago'],
  },
  items: [
    anItem('libro-antiguo', 'Libro Antiguo', ['libro', 'libro abierto'], 'Un viejo libro abierto con páginas llenas de símbolos mágicos y anotaciones. Parece contener pistas.', 'torre-mago', false),
    anItem('varita-rota', 'Varita Rota', ['varita'], 'Una varita mágica partida por la mitad, quizás pueda repararse.', 'torre-mago', true, 'Recojo la varita rota.'),
    anItem('gema-roja', 'Gema Roja', ['gema'], 'Una brillante gema roja, emite un tenue resplandor mágico.', 'torre-mago', true, 'Recojo la gema roja.'),
    anItem('arcon', 'Arcón', ['cofre'], [
      aCondDesc('!unlocked:open-arcon', 'Un arcón cerrado con un candado mágico que requiere una gema especial.'),
      aCondDesc('unlocked:open-arcon', 'El arcón está abierto y vacío.'),
    ], 'torre-mago', false),
    anItem('llave-cripta', 'Llave de la Cripta', ['llave'], 'Una llave mágica adornada con símbolos antiguos.', 'torre-mago', true, 'Recojo la llave de la cripta.'),
    anItem('pedestal', 'Pedestal', ['altar'], 'Un pedestal con una ranura en la que parece encajar algo.', 'cripta-subterranea', false),
    anItem('puerta-salida', 'Puerta con Símbolos', ['puerta'], [
      aCondDesc('!unlocked:cripta-abierta', 'Una puerta cerrada con símbolos mágicos que parece necesitar un objeto mágico para abrirse.'),
      aCondDesc('unlocked:cripta-abierta', 'La puerta está abierta y el camino a la libertad despejado.'),
    ], 'cripta-subterranea', false),
  ],
  usages: [
    anUsage(['gema-roja', 'arcon'], [
      anUnlockingAction('Al colocar la gema en el arcón, el candado mágico se desvanece y el arcón se abre revelando una llave.', 'open-arcon'),
      aPickingAction('Recojo la llave de la cripta del arcón.', 'llave-cripta'),
    ], true),

    anUsage(['varita-rota', 'libro-antiguo'], [
      'El libro indica cómo reparar una varita rota usando una gema roja. Quizás deba usar la gema con la varita.',
    ], false),

    anUsage(['varita-rota', 'gema-roja'], [
      aPickingAction('Siguiendo las instrucciones del libro, coloco la gema en la varita. ¡La varita está reparada y emite una luz mágica intensa!', 'varita-reparada'),
    ], true),

    anUsage(['llave-cripta', 'pedestal'], [
      anUnlockingAction('Introduzco la llave mágica en el pedestal. Los símbolos brillan y la puerta mágica se abre lentamente.', 'cripta-abierta'),
    ], true),

    anUsage('puerta-salida', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:cripta-abierta', 'La puerta está bloqueada por una magia poderosa, debo encontrar cómo abrirla.'),
        aCondDescUsage(false, 'unlocked:cripta-abierta', theEndingScene('¡La puerta está abierta! Hemos escapado de la torre encantada. ¡Felicidades aventurero!')),
      ]),
    ], false),
  ],
};