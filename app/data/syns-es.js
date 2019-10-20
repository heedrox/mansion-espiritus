const synsRecibidor = ['entrada', 'recibidor', 'sala de la entrada', 'sala recibidor', 'salón recibidor', 'hall'];
const synsCocina = ['cocina', 'despensa', 'sala de la cocina'];
const synsSalaEstar = ['sala de estar', 'sala', 'salón', 'sala principal'];
const synsDormitorio = ['dormitorio', 'dormidor', 'habitación', 'sala de la cama'];
const synsSotano = ['sótano', 'bunker', 'bodega'];

const syns = {
  rooms: {
    'recibidor': synsRecibidor,
    'cocina': synsCocina,
    'sala-estar': synsSalaEstar,
    'dormitorio': synsDormitorio,
    'sotano': synsSotano,
  },
  items: {
    'artilugio-dorm': ['artilugio','artilugio con palancas', 'palancas', 'puerta', 'puerta del infierno', 'infierno', 'inframundo', 'puerta del inframundo', 'puerta infierno', 'puerta inframundo', 'muerte', 'otra dimensión', 'puerta a otra dimensión', 'puerta de la dimensión', 'artilugio del infierno', 'artilugio infernal', 'puerta infernal', 'espíritus', 'otros espíritus'],
    'mural-recib': ['mural', 'mural en la pared', 'mural de la pared', 'cuadro', 'cuadro en pared', 'colores'],
    'estanteria-recib': ['estantería', 'biblioteca', 'libros', 'libreria'],
    'libro-espiritus-recib': ['libro sobre espíritus', 'lectura de espíritus', 'libro sobre los espíritus','libro con espíritus', 'el de los espíritus '],
    'libro-colores-recib': ['libro sobre colores', 'libro del arte de colores',  'libro de arte de colores', 'libro sobre los colores', 'el arte de los colores'],
    'arcon-recib': ['arcón', 'arcón del recibidor', 'arcón en el recibidor', 'baúl', 'baúl en el recibidor', 'caja', 'candado', 'cerradura'],
    'escudo-recib': ['escudo del recibidor', 'escudo dentro del arcón', 'escudo del arcón', 'escudo del baúl', 'escudo de dentro del baúl', 'escudo de dentro del arcón'],
    'mesa-recib': ['mesa', 'mesa del recibidor', 'mesa con velas'],
    'hechizo-recib': ['hechizo', 'hechizo para bendecir agua', 'hechizo para agua bendita', 'hechizo para el agua', 'hechizo para bendecir agua', 'hechizo de agua bendita'],
    'chimenea-sala': ['chimenea', 'chimenea del salón', 'chimenea bajo el cuadro', 'chimenea en la sala','chimenea y cuadro', 'chimenea con cuadro'  ],
    'cuadro-sala': ['cuadro', 'cuadro sobre la chimenea', 'cuadro de encima de la chimenea', 'cuadro de encima' ],
    'lobo-sala': ['lobo', 'espíritu', 'fantasma', 'espíritu del lobo', 'espíritu de lobo', 'fantasma del lobo', 'fantasma de lobo'],
    'espiritu-cocina': ['espíritu', 'espíritu de fuego', 'fantasma de fuego', 'fuego'],
    'vaso-cocina': ['vaso', 'vaso lleno de agua', 'vaso con agua', 'vaso de agua', 'vaso a tope de agua', 'agua'],
    'mesa-cocina': ['mesa', 'mesa de la cocina', 'mesa con vaso de agua', 'mesa del vaso', 'mesa en la cocina', 'mesa de cocina'],
    'armario-cocina': ['armarios', 'armario de la cocina', 'armario en la cocina', 'armario', 'cuchillos', 'cucharas', 'tenedores', 'tenedor', 'cuchillo', 'cuchara', 'cuchillos cucharas y tenedores', 'cuchillos cucharas', 'juegos de cocina', 'juegos']
  },
};

exports.syns = syns;
