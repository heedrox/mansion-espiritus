const { intentMapper } = require('../intents/intent-mapper');
const { answerArconCode } = require('../plugins/answer-arcon-code');
const { pickAndUnlock } = require('../plugins/pick-and-unlock');
const { theEndingScene, anUnlockingAction, aPickingAction, anAnswer, aCommandSyn, Commands, aRoom, anItem, aLockedDestination, aCondDescUsage, aCondDesc, anUsage, aConditionalResponse, pluginExtension, anExpectAnswerAction } = require('scure').dsl;
const { syns } = require('./syns-es');
const { DOOR_AUDIOS, DESCRIPCION_INFIERNO, HELLO, DESCRIPCION_MURAL, OPEN_ARCON_AUDIO } = require('./audios-es');

const OSES_SPELL = 'O<break strength="weak"/>S<break strength="weak"/>E<break strength="weak"/>S';

exports.data = {
  sentences: {
    help: 'Me puedes dar instrucciones para que vaya de un sitio a otro, para mirar objetos, usarlos y cogerlos. Por ejemplo, puedes pedirme que mire alrededor para ver qué hay. Quedan {time}. ',
    'help-no-screen': 'Me puedes dar instrucciones para que vaya de un sitio a otro, para mirar objetos, usarlos y cogerlos. Quedan {time}. ',
    fallback: 'Perdona, no te entiendo. Respondo mejor a comandos como mirar, usar, coger e ir. Quedan {time}. ',
    destinations: 'Desde aquí puedo ir a: {destinations}. ',
    'destination-unknown': 'No sé ir a {destination}. ',
    'remaining-time': '{minutes} minutos y {seconds} segundos',
    'ending-remaining-time': 'Quedaban {timeLeft}',
    'item-not-in-location': 'No encuentro o veo ese objeto. ',
    'item-notseen': 'No veo el objeto {name} por aquí. ',
    'item-unknown': 'No te he entendido qué quieres que me lleve. ',
    'item-pickedup': 'Ok, me llevo el objeto {name}. ',
    'item-notpickable': 'No puedo llevarme el objeto {name}. ',
    'item-alreadyinventory': 'Ya llevo el objeto {name}. ',
    'item-alreadypicked': 'Ya me llevo el objeto {name}. ',
    'use-noarg': 'Dime qué objeto u objetos quieres que use. ',
    'use-cant': 'No puedo usar el objeto {item}. ',
    'use-canttwo': 'No puedo usar los objetos {item1} y {item2} entre sí. ',
    'use-onlyonce': 'Ya utilicé ese objeto. No puedo usarlo otra vez. ',
    'use-onlyonce-two': 'Ya utilicé esos objetos. No puedo usarlos otra vez. ',
    inventory: 'Llevo los siguientes objetos encima: {items}. ',
    'inventory-nothing': 'No llevo nada encima. ',
    bye: 'Ha sido un placer trabajar contigo. Es una lástima que no hayamos podido salvarnos. Intentémoslo otra vez más adelante. ¡Gracias!',
    'end-timeover': [
      aCondDesc('!unlocked:closed-hell', 'Ya no hay tiempo; no hemos cerrado la puerta del inframundo y esto ha permitido que el infierno se haya desatado en la tierra. La humanidad arderá hasta el fin de sus días. Lo siento. ¡Intentémoslo otra vez!'),
      aCondDesc('unlocked:closed-hell', 'Ya no hay tiempo; te has desangrado y has muerto. Lo siento. ¡Intentémoslo otra vez!')
    ],
    'answer-cant': '¿Perdona? No estaba esperando una respuesta. Si me estás contestando a un código, utiliza antes el objeto en cuestión.',
    'walk-nowhere': 'Desde aquí no podemos ir a ningún sitio. ¡Busca una salida!',
    'walking-sound': DOOR_AUDIOS,
    'final-question': '¿Qué hacemos ahora?',
    'arcon-wrong': 'No, ese número no abre el baúl.',
    'arcon-wrong-back': 'No, ese número no abre el baúl... Pero me pregunto si las letras del mural querrán decir algo.',
  },
  init: {
    totalMinutes: 15,
    roomId: 'recibidor',
    welcome: [HELLO],
  },
  rooms: [
    aRoom('recibidor', 'recibidor', syns.rooms['recibidor'], 'En el recibidor puedo ver un baúl, un mural en la pared, una estantería y una mesa.'),
    aRoom('cocina', 'cocina', syns.rooms['cocina'], [
      aCondDesc('!unlocked:killed-spirit-fire', 'En la cocina veo un espíritu que arde y flota en el centro. El espíritu no me deja interactuar con nada.'),
      aCondDesc('unlocked:killed-spirit-fire', 'En la cocina puedo ver una mesa y unos armarios'),
    ]),
    aRoom('sala-estar', 'sala de estar', syns.rooms['sala-estar'], [
      aCondDesc('!unlocked:killed-spirit-wolf', 'En la sala de estar veo un espíritu de un lobo que se mueve por la habitación. El espíritu no me deja interactuar con nada.'),
      aCondDesc('unlocked:killed-spirit-wolf', 'En la sala de estar puedo ver una chimenea con un cuadro encima.'),
    ]),
    aRoom('dormitorio', 'dormitorio', syns.rooms['dormitorio'], [
      aCondDesc('!unlocked:closed-hell', 'En el dormitorio veo una cama grande y un artilugio cuadrado con palancas. En el centro del artilugio puedo ver el infierno.'),
      aCondDesc('unlocked:closed-hell', 'En la sala de estar puedo ver una chimenea con un cuadro encima.'),
    ]),
    aRoom('sotano', 'sótano', syns.rooms['sotano'], 'Estoy en el centro de comunicaciones del otro lado. Desde el ordenador se pueden oir conversaciones, pero se oyen extrañas. ¿Como si estuvieran al revés?'),
  ],
  mapImage: {
    url: 'https://the-anomaly-897ce.firebaseapp.com/the-anomaly-map.jpg',
    alt: 'Mapa con: entrada, laboratorio y comunicaciones.',
  },
  map: {
    'recibidor': ['sala-estar', 'cocina', 'dormitorio'],
    'sala-estar': ['recibidor'],
    'cocina': ['recibidor'],
    'dormitorio': ['recibidor', aLockedDestination('sotano', 'closed-hell')],
    'sotano': ['dormitorio'],
  },
  items: [
    anItem('artilugio-dorm', 'Artilugio', syns.items['artilugio-dorm'], DESCRIPCION_INFIERNO, 'dormitorio', false),
    anItem('mural-recib', 'Mural', syns.items['mural-recib'], DESCRIPCION_MURAL, 'recibidor', false),
    anItem('estanteria-recib', 'Estantería', syns.items['estanteria-recib'], 'Una estantería con muchos libros. Los más relevantes son un libro sobre el arte de los colores y un libro sobre espíritus.', 'recibidor', false),
    anItem('libro-espiritus-recib', 'Libro sobre espíritus', syns.items['libro-espiritus-recib'], 'Un libro con información sobre espíritus. Debería leerlo.', 'recibidor', false, 'No tiene sentido que me lo lleve. Puedo leerlo aquí.'),
    anItem('libro-colores-recib', 'Libro sobre colores', syns.items['libro-colores-recib'], 'Un libro sobre el arte de colores. Debería leerlo.', 'recibidor', false, 'No tiene sentido que me lo lleve. Puedo leerlo aquí.'),
    anItem('arcon-recib', 'Arcón', syns.items['arcon-recib'], [
      aCondDesc('!unlocked:open-arcon', 'Un arcón cerrado, con un candado de 4 cifras.'),
      aCondDesc('unlocked:open-arcon', 'Un arcón que ya hemos abierto, pasemos a otra cosa.'),
      ], 'recibidor', false, 'Demasiado grande para llevármelo.'),
    anItem('escudo-recib', 'Escudo', syns.items['escudo-recib'], [
      aCondDesc('!unlocked:open-arcon', '¿De qué escudo me hablas?'),
      aCondDesc('unlocked:open-arcon', 'Es el escudo que nos llevamos del arcón. Tiene un símbolo de un lobo en el centro.'),
    ], 'recibidor', false)
  ],
  usages: [
    anUsage('artilugio-dorm', [
        aConditionalResponse([
          aCondDescUsage(false,'!unlocked:killed-spirit-fire', 'No puedo yo solo, son 2 palancas en cada extremo, así que te necesito, pero no puedes entrar, ya que detecto espíritus en otras habitaciones de esta mansión. Antes debemos deshacernos de ellos.'),
          aCondDescUsage(false,'!unlocked:killed-spirit-wolf', 'No puedo yo solo, son 2 palancas en cada extremo, así que te necesito, pero no puedes entrar, ya que detecto espíritus en otras habitaciones de esta mansión. Antes debemos deshacernos de ellos.'),
          aCondDescUsage(false,'unlocked:killed-spirit-wolf', 'AHORA UNLOCKEAR NO SE QUE ')
        ])], false),
    anUsage('libro-colores-recib', [
      'Es un libro de Isaac Newton, en el que hace un estudio sobre los 7 colores del arco iris, y su orden de aparición. El libro tiene más páginas.',
      'El color rojo es el primero, el número uno. Luego están el naranja, el amarillo y el verde. ',
      'Los últimos tres son el cian, el azul y el violeta. ',
    ], false),
    anUsage('arcon-recib', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:open-arcon', anExpectAnswerAction('Para abrirlo, necesitamos un código de 4 cifras. Dime un número. ¿Cuál pongo?', 'code-arcon-recib')),
        aCondDescUsage(false, 'unlocked:open-arcon', 'El arcón ya está abierto y gracias a él, nos llevamos un escudo. Pasemos a otra cosa.'),
      ])
    ], false),

  ],
  answers: [
    anAnswer('code-arcon-recib', '3416', pluginExtension(pickAndUnlock('escudo-recib', 'open-arcon', OPEN_ARCON_AUDIO)), pluginExtension(answerArconCode)),
  ],
  intentMapper,
  directSentences: {
    'sigue-leyendo': ['sigue leyendo', 'lee más', 'continúa', 'continua', 'continúa leyendo', 'continua leyendo']
  },
  commandSyns: [
    aCommandSyn(Commands.LOOK, 'libro-colores-recib', Commands.USE),
  ]
};
