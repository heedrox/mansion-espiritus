const { anItem, aCondDesc } = require('scure').dsl;

exports.data = {
  sentences: {
    help: 'Me puedes dar las siguientes instrucciones: Mirar, Usar, Ir, Coger e Inventario. Quedan {time}. ',
    'arcon-wrong': 'No, ese número no abre el baúl.',
    'arcon-wrong-back': 'No, ese número no abre el baúl... Pero me pregunto si las letras del mural querrán decir algo.',
    'remaining-time': '{minutes} minutos y {seconds} segundos',
    'caja-fuerte-answer-3584': 'No creo que haya que ponerlo al revés. Demasiado rebuscado.',
    'caja-fuerte-answer-6143': '¿No has oído nunca lo de que un código solo sirve una vez? Venga, dime qué hacemos ahora.',
    'caja-fuerte-answer-3416': '¿No has oído nunca lo de que un código solo sirve una vez? Venga, dime qué hacemos ahora.',
    'caja-fuerte-answer-default': 'No, parece que ese código no es.',
  },
  init: {
    totalMinutes: 15,
  },
  items: [
    anItem('escudo-recib', 'Escudo', [ 'escudito' ], [
      aCondDesc('!unlocked:open-arcon', '¿De qué escudo me hablas?'),
      aCondDesc('unlocked:open-arcon', 'Es el escudo que nos llevamos del arcón. Tiene un símbolo de un lobo en el centro.'),
    ], 'recibidor', false)
  ],
  directSentences: {
    'sigue-leyendo': ['sigue leyendo', 'lee más', 'continúa', 'continua']
  },
};
