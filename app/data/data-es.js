const { theEndingScene, anUnlockingAction, aPickingAction, anAnswer, aCommandSyn, Commands, aRoom, anItem, aLockedDestination, aCondDescUsage, aCondDesc, anUsage, aConditionalResponse, pluginExtension, anExpectAnswerAction } = require('scure').dsl;
const { syns } = require('./syns-es');
const { OPEN_BOX_AUDIO, HELLO, LASER_ON_AUDIO, GRABACION_AUDIO, ENDING_AUDIO } = require('./audios-es');

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
    'final-question': '¿Qué hacemos ahora?',
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
    anItem('mesa-e1', 'Mesa', syns.items['mesa-e1'], [
      aCondDesc('!unlocked:cajon-e1', 'Es una mesa que tiene un cajón. Parece que el cajón está cerrado. Necesita una llave.'),
      aCondDesc('!picked:laser-e1', 'La mesa tiene un cajón, que ya hemos abierto. Parece que dentro de éste hay algo...'),
      aCondDesc('picked:laser-e1', 'La mesa tiene un cajón, que ya hemos abierto.'),
    ], 'entrada', false),
    anItem('cajon-e1', 'Cajón', syns.items['cajon-e1'], [
      aCondDesc('!unlocked:cajon-e1', 'El cajón está cerrado.'),
      aCondDesc('!picked:puntero-e1', 'Dentro del cajón veo un puntero láser portátil.'),
      aCondDesc('picked:puntero-e1', 'El cajón de la mesa está abierto, pero ya no tiene nada dentro.'),
    ], 'entrada', false),
    anItem('anomalia-l1', 'Anomalía', syns.items['anomalia-l1'],
      'Es la brecha en el espacio tiempo, de tinte verdoso, que se encuentra flotando en el aire en medio del laboratorio. Es lo suficientemente grande como permitirme ver que hay algo al otro lado; creo que lo puedo cruzar.', 'laboratorio', false),
    anItem('anomalia-l2', 'Anomalía del otro lado', syns.items['anomalia-l2'],
      'Es la brecha en el espacio tiempo, de tinte verdoso, que se encuentra flotando en el aire en medio del laboratorio. ', 'laboratorio-other', false),
    anItem('laser-l2', 'Láser', syns.items['laser-l2'], [
      aCondDesc('!unlocked:laser-l2', 'Es un aparato enorme. Está apagado.'),
      aCondDesc('unlocked:laser-l2', 'Está encendido. Un rayo de luz azul recorre el laboratorio y atraviesa la anomalía.'),
    ], 'laboratorio-other', false),
    anItem('estanteria-l2', 'estantería', syns.items['estanteria-l2'],
      'Es una estantería. Lo más destacable es un libro que pone "Diario del laboratorio".', 'laboratorio-other', false),
    anItem('libro-l2', 'libro', syns.items['libro-l2'], 'Es el diario del laboratorio.', 'laboratorio-other', false),
    anItem('mesa-e2', 'Mesa', syns.items['mesa-e2'], 'Es la mesa en la entrada del complejo del otro lado. Tiene una caja encima. También tiene un cajón, y éste, por suerte, está abierto.', 'entrada-other', false),
    anItem('cajon-e2', 'Cajon', syns.items['cajon-e2'], 'Tiene un papel dentro con escritura que parece de una niña pequeña.', 'entrada-other', false),
    anItem('papel-e2', 'Papel', syns.items['papel-e2'], 'En el papel está escrito lo siguiente: Papá, te he escondido algo dentro del juego que me regalaste. ¡Tienes que intentar adivinar la combinación en la menor cantidad posible de intentos! ¡Recuerda que los números no pueden repetirse!.', 'entrada-other', false),
    anItem('caja-e2', 'Caja', syns.items['caja-e2'], 'Más que una caja de seguridad parece un juego. La caja es digital, y tiene un teclado para introducir un código de 3 dígitos. Creo que alguien ha encerrado algo que nos puede interesar dentro de esta caja. ', 'entrada-other', false),
    anItem('llave-e2', 'Llave', syns.items['llave-e2'], [
      aCondDesc('!picked:llave-e2', '¿De qué llave me hablas?'),
      aCondDesc('picked:llave-e2', 'Es la llave de la mesa de la entrada. Si abre el cajón del otro lado, quizás...'),
    ], 'entrada-other', false),
    anItem('linterna-e1', 'Linterna azul', syns.items['linterna-e1'], [
      aCondDesc('!picked:linterna-e1', '¿De qué linterna me hablas?'),
      aCondDesc('picked:linterna-e1', 'Es una linterna que emite un color rojo muy intenso. '),
    ], 'entrada', false),
    anItem('conversaciones-c2', 'Conversaciones', syns.items['conversaciones-c2'], 'Oigo conversaciones ligeramente al revés, son indescifrables. Sin embargo en el ordenador veo algo.', 'comunicaciones-other', false),
    anItem('ordenador-c2', 'Ordenador', syns.items['ordenador-c2'], '<speak>En el ordenador veo, en mayúsculas, las siguientes letras: ' + OSES_SPELL + '</speak>', 'comunicaciones-other', false),
    anItem('ordenador-c1', 'Ordenador', syns.items['ordenador-c1'], 'El ordenador está apagado. Para encenderlo hay que introducir el número de canal.', 'comunicaciones', false),
    anItem('grabacion-c1', 'Grabación', syns.items['grabacion-c1'], 'Una grabación', false),
  ],
  usages: [
    anUsage('cajon-e1', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:cajon-e1', 'Para abrir el cajón creo que necesitamos una llave.'),
        aCondDescUsage(false, '!picked:puntero-e1', 'Ya hemos abierto el cajón. Se ve un puntero láser portátil dentro.'),
        aCondDescUsage(false, 'picked:puntero-e1', 'Ya hemos abierto el cajón, y está vacío.'),
      ]),
    ], false),
    anUsage('anomalia-l1', 'xxx', false),
    anUsage('anomalia-l2', 'zzzz', false),
    anUsage(['llave-e2', 'cajon-e2'], ['El cajón ya está abierto. No hace falta usar la llave aquí. '], false),
    anUsage('papel-e2', ['En el papel está escrito lo siguiente: Papá, te he dejado la llave del cajón dentro del juego que me regalaste. ¡Tienes que intentar adivinar la combinación en la menor cantidad posible de intentos! ¡Recuerda que los números no pueden repetirse!.'], false),
    anUsage('cajon-e2', ['El cajón ya está abierto, no hace falta abrirlo más. Quizás te interese leer el papel que hay dentro.'], false),
    anUsage('caja-e2', [
      aConditionalResponse([
        aCondDescUsage(false, '!picked:llave-e2', anExpectAnswerAction('¿Qué código quieres introducir? Dime un número de 3 cifras y lo pongo en la caja.', 'mastermind-e2')),
        aCondDescUsage(false, 'picked:llave-e2', 'Ya he abierto el juego. No necesito más. '),
      ])
    ], false),
    anUsage(['llave-e2', 'cajon-e1'], [aPickingAction('Dentro hay una linterna. Parece que emite color rojo. Me la llevo.', 'linterna-e1')], true),
    anUsage('libro-l2', [
      'Es el diario del laboratorio. En las primeras páginas dice algo así como: "Lo que hicimos está mal. No debimos intentar jugar a ser dioses. Hemos rasgado el tejido de la creación, y ahora, debemos pagar las consecuencias". Parece que hay más',
      'En las siguientes páginas dice: "Creemos que hay alguien al otro lado. Les mandaremos un mensaje a través de nuestros sistemas de comunicaciones con lo que hemos aprendido. No nos queda más tiempo, tenemos que irnos. Temo por mi hija.".',
      'Casi en las últimas páginas se lee: "Lo que hay al otro lado parece un universo similar al nuestro. Creemos que algunas dimensiones se mueven en dirección ligeramente diferente, algunas parece que casi al revés. Eso hace, por ejemplo, que los números, los lean al revés que nosotros."',
      'En la contraportada se lee un código de 6 cifras, sin embargo los primeros 2 dígitos no se ven bien. Los últimos cuatro son 1 0 1 5.',
    ], false),
    anUsage('ordenador-c2', [
      '<speak>El ordenador ya está encendido y no puedo interactuar con él. Parece que está emitiendo en un canal predefinido. Pone en mayúsculas 4 letras: ' + OSES_SPELL + '</speak>',
      '<speak>Parece que ya está emitiendo conversaciones en un canal predefinido. El canal tiene 4 letras: ' + OSES_SPELL + '</speak>',
      '<speak>¿Qué puede significar el canal ' + OSES_SPELL + '? En mayúsculas.</speak>',
      '<speak>El canal debería ser un número, y sin embargo, son 4 letras, ¿o no? ' + OSES_SPELL + '</speak>',
      '<speak>Esto parece el mundo del revés. Deberían ser números y sin embargo son 4 letras. ' + OSES_SPELL + '</speak>'
    ], false),
    anUsage('ordenador-c1', [anExpectAnswerAction('Parece que son 4 cifras. ¿Qué canal quieres escuchar?', 'ordenador-canal-c1')], false),
    anUsage('grabacion-c1', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:lock-conversacion-c1', '¿Qué conversaciones? No oigo nada. El ordenador de comunicaciones está apagado.'),
        aCondDescUsage(false, 'unlocked:lock-conversacion-c1', GRABACION_AUDIO),
      ]),
    ], false),
    anUsage('laser-l2', [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:laser-l2', anExpectAnswerAction('Para encenderse necesita un código de 6 cifras. ¿Cuál pongo?', 'laser-codigo-l2')),
        aCondDescUsage(false, 'unlocked:laser-l2', 'El láser ya está encendido, y emite una potente luz azul hacia la anomalía.'),
      ])
    ], false),
    anUsage(['linterna-e1', 'laser-l2'], ['La luz azul del láser con la luz roja de la linterna, hacen una luz violeta.']),
    anUsage(['linterna-e1', 'anomalia-l2'], [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:laser-l2', 'La luz roja de la linterna con la luz verde de la anomalía hacen una luz amarilla. No es suficiente para cerrarla.'),
        aCondDescUsage(false, 'unlocked:laser-l2', theEndingScene(ENDING_AUDIO)),
      ])
    ], false),
    anUsage(['linterna-e1', 'anomalia-l1'], [
      aConditionalResponse([
        aCondDescUsage(false, '!unlocked:laser-l2', 'La luz roja de la linterna con la luz verde de la anomalía hacen una luz amarilla. No es suficiente para cerrarla.'),
        aCondDescUsage(false, 'unlocked:laser-l2', theEndingScene(ENDING_AUDIO)),
      ])
    ], false),
  ],
  answers: [
    anAnswer('mastermind-e2', '269', aPickingAction(OPEN_BOX_AUDIO, 'llave-e2'), 'xxxxx'),
    anAnswer('ordenador-canal-c1', '5350', anUnlockingAction(GRABACION_AUDIO, 'lock-grabacion-c1'), 'Introduzco el canal {userAnswer} pero no se oye nada. Creo que no es el correcto.'),
    anAnswer('laser-codigo-l2', '211015', anUnlockingAction(LASER_ON_AUDIO, 'laser-l2'), 'No, con el código {userAnswer} el láser no se enciende.'),
  ],
  commandSyns: [
    aCommandSyn(Commands.WALK, 'anomalia-l1', Commands.USE),
    aCommandSyn(Commands.PICKUP, 'anomalia-l1', Commands.USE),
    aCommandSyn(Commands.PICKUP, 'papel-e2', Commands.USE),
    aCommandSyn(Commands.PICKUP, 'cajon-e2', Commands.USE),
    aCommandSyn(Commands.LOOK, 'libro-l2', Commands.USE),
    aCommandSyn(Commands.LOOK, 'grabacion-c1', Commands.USE),
  ]
};
