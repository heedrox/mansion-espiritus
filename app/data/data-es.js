const { intentMapper } = require('../intents/intent-mapper');
const { answerArconCode } = require('../plugins/answer-arcon-code');
const { pickAndUnlock } = require('../plugins/pick-and-unlock');
const { theEndingScene, anUnlockingAction, aPickingAction, anAnswer, aCommandSyn, Commands, aRoom, anItem, aLockedDestination, aCondDescUsage, aCondDesc, anUsage, aConditionalResponse, pluginExtension, anExpectAnswerAction } = require('scure').dsl;
const { syns } = require('./syns-es');
const { DOOR_AUDIOS, DESCRIPCION_INFIERNO, HELLO, DESCRIPCION_MURAL, OPEN_ARCON_AUDIO, WOLF_AUDIO, WOLF_SHIELD_AUDIO, FIRE_AUDIO, FIRE_KILL_AUDIO, CLOSE_HELL_AUDIO } = require('./audios-es');

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
      aCondDesc('!unlocked:killed-spirit-fire', FIRE_AUDIO + 'En la cocina veo un espíritu que arde y flota en el centro. Además, veo una mesa y un armario.'),
      aCondDesc('unlocked:killed-spirit-fire', 'En la cocina veo una mesa y un armario.'),
    ]),
    aRoom('sala-estar', 'sala de estar', syns.rooms['sala-estar'], [
      aCondDesc('!unlocked:killed-spirit-wolf', WOLF_AUDIO + 'Eso es un espíritu de un lobo que se mueve por la habitación. Además, en el salón veo una chimenea y un cuadro encima. Pero intentemos quitarnos de encima ese lobo primero.'),
      aCondDesc('unlocked:killed-spirit-wolf', 'Este salón tiene una chimenea y un cuadro encima.'),
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
    ], 'recibidor', false),
    anItem('hechizo-recib', 'Hechizo', syns.items['hechizo-recib'], [
      aCondDesc('!picked:hechizo-recib', 'Si hay un hechizo en algún sitio, debo hallarlo primero.'),
      aCondDesc('picked:hechizo-recib', 'Es un hechizo para bendecir agua. Hechizos. Aquí. En la vida real.')
    ], 'recibidor', false),
    anItem('mesa-recib', 'Mesa', syns.items['mesa-recib'], 'Una mesa cuadrada con una vela en cada esquina. Muy acogedor.', 'recibidor', false, 'Que me llevo la mesa conmigo. Sí, y qué más. O sea, no.'),
    anItem('chimenea-sala', 'Chimenea', syns.items['chimenea-sala'], 'Una chimenea. El cuadro de encima parece interesante.', 'sala-estar', false),
    anItem('cuadro-sala', 'Cuadro', syns.items['cuadro-sala'], 'Un cuadro con cuatro objetos, de izquierda a derecha, una vela, una rosa, una cuchara y un ojo.', 'sala-estar', false),
    anItem('lobo-sala', 'Lobo', syns.items['lobo-sala'], [
      aCondDesc('!unlocked:killed-spirit-wolf', WOLF_AUDIO + 'Da mucho miedo el espíritu del lobo. ¿Se te ocurre alguna forma de deshacernos de él?'),
      aCondDesc('unlocked:killed-spirit-wolf', '¿Dónde? Yo creo que el lobo ya no está por la mansión.')
    ], 'sala-estar', false),
    anItem('espiritu-cocina', 'Espíritu de la cocina', syns.items['espiritu-cocina'], [
      aCondDesc('!unlocked:killed-spirit-fire', FIRE_AUDIO + 'Da mucho miedo el espíritu de fuego. ¿Se te ocurre alguna forma de deshacernos de él?'),
      aCondDesc('unlocked:killed-spirit-fire', 'Un charlo en el centro de la cocina es el único recordatorio de la amenaza que hemos destruido.')
    ], 'cocina', false),
    anItem('mesa-cocina', 'Mesa', syns.items['mesa-cocina'], [
      aCondDesc('!unlocked:killed-spirit-fire', 'Encima de la mesa hay un vaso de agua.'),
      aCondDesc('unlocked:killed-spirit-fire', 'La mesa está hecha un desastre tras la explosión del vaso.'),
    ], 'cocina', false, 'Que me llevo la mesa conmigo. Quizás el agua es más interesante.'),
    anItem('vaso-cocina', 'Vaso', syns.items['vaso-cocina'], [
      aCondDesc('!unlocked:killed-spirit-fire', 'Un vaso lleno de agua, pero lejos de mi alcance.'),
      aCondDesc('unlocked:killed-spirit-fire', 'El vaso ha explotado y está inservible.'),
      ], 'cocina', false, 'Imposible coger ese vaso.'),
    anItem('armario-cocina', 'Armario', syns.items['armario-cocina'],
      'En el armario cuento hasta 5 juegos de cuchillos, cucharas y tenedores. '
    , 'cocina', false),
    anItem('cama-dormitorio', 'Cama', syns.items['cama-dormitorio'],
      'Una cama con un estampado de rosas. Cuento hasta 4 rosas en las sábanas. La cama tiene un par de almohadas, con un estampado de una rosa en cada una. '
    , 'dormitorio', false, 'La cama se queda donde está.')

  ],
  usages: [
    anUsage('artilugio-dorm', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:killed-spirit-fire', 'No puedo yo solo, son 2 palancas en cada extremo, así que te necesito, pero no puedes entrar, ya que detecto espíritus en otras habitaciones de esta mansión. Antes debemos deshacernos de ellos.'),
        aCondDescUsage(false, '!unlocked:killed-spirit-wolf', 'No puedo yo solo, son 2 palancas en cada extremo, así que te necesito, pero no puedes entrar, ya que detecto espíritus en otras habitaciones de esta mansión. Antes debemos deshacernos de ellos.'),
        aCondDescUsage(false, 'unlocked:killed-spirit-wolf', pluginExtension(closeHell(CLOSE_HELL_AUDIO))),
      ])], false),
    anUsage('libro-colores-recib', [
      'Es un libro de Isaac Newton, en el que hace un estudio sobre los 7 colores del arco iris, y su orden de aparición. El libro tiene más páginas.',
      'El color rojo es el primero, el número uno. Luego están el naranja, el amarillo y el verde. ',
      'Los últimos tres son el cian, el azul y el violeta. ',
    ], false),
    anUsage('libro-espiritus-recib', [
      'Es un libro con información sobre los espíritus elementales. Hay más páginas.',
      'Dice que el agua bendita permite deshacerse de espíritus de fuego. ',
      aConditionalResponse([
        aCondDescUsage(false, '!picked:hechizo-recib', aPickingAction('En la última página hay un hechizo para bandecir agua. Me lo llevo.', 'hechizo-recib')),
        aCondDescUsage(false, 'picked:hechizo-recib', 'En la última página obtuve el hechizo. Venga, va, de verdad, ¿un hechizo?'),
      ])
    ], false),

    anUsage('arcon-recib', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:open-arcon', anExpectAnswerAction('Para abrirlo, necesitamos un código de 4 cifras. Dime un número. ¿Cuál pongo?', 'code-arcon-recib')),
        aCondDescUsage(false, 'unlocked:open-arcon', 'El arcón ya está abierto y gracias a él, nos llevamos un escudo. Pasemos a otra cosa.'),
      ])
    ], false),
    anUsage('chimenea-sala', ['No puedo mover esa chimenea. Pero el cuadro, eso sí parece interesante'], false),
    anUsage('cuadro-sala', ['Más que moverlo, creo que con mirarlo es suficiente.'], false),
    anUsage('lobo-sala', [
      aConditionalResponse([
        aCondDesc('!unlocked:killed-spirit-wolf', '¿Por qué no vienes tú y lo atacas así, sin más? Pues eso, yo tampoco'),
        aCondDesc('unlocked:killed-spirit-wolf', 'El lobo ha huido y ya no está aquí. ¿Podemos centrarnos?'),
      ])
    ], false),
    anUsage(['escudo-recib', 'lobo-sala'], [anUnlockingAction(WOLF_SHIELD_AUDIO, 'killed-spirit-wolf')], true),
    anUsage('espiritu-cocina', [
      aConditionalResponse([
        aCondDesc('!unlocked:killed-spirit-fire', '¿Por qué no vienes tú y lo atacas así, sin más? Pues eso, yo tampoco'),
        aCondDesc('unlocked:killed-spirit-fire', 'Ya hemos eliminado el espíritu, con agua bendita, ¿lo recuerdas?'),
      ])
    ], false),
    anUsage('vaso-cocina', 'El vaso está lleno de agua, no se puede hacer nada más con él', false),
    anUsage('mesa-cocina', 'La mesa no se puede mover.', false),
    anUsage(['vaso-cocina', 'hechizo-recib'], [
      anUnlockingAction(FIRE_KILL_AUDIO, 'killed-spirit-fire')
    ], true),
    anUsage(['vaso-cocina', 'espiritu-cocina'], [
      aConditionalResponse([
        aCondDesc('!unlocked:killed-spirit-fire', FIRE_AUDIO + 'Uy, sí, ¿qué crees que podemos hacerle con agua? Yo no le enfadaría más.'),
        aCondDesc('unlocked:killed-spirit-fire', 'El espíritu de fuego se desintegró y ya no está aquí. Tu alzheimer me preocupa. '),
      ]),
    ], false),
    anUsage('armario-cocina', [ 'En el armario cuento hasta 5 juegos de cuchillos, cucharas y tenedores.' ], false),
    anUsage('cama-dormitorio', [ 'No es el momento de una siesta.' ], false),
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
    aCommandSyn(Commands.LOOK, 'libro-espiritus-recib', Commands.USE),
  ]
};
