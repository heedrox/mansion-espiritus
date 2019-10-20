const synsRecibidor = ['entrada', 'recibidor', 'sala de la entrada', 'sala recibidor', 'salón recibidor', 'hall'];
const synsCocina = ['cocina', 'despensa', 'sala de la cocina'];
const synsSalaEstar = ['sala de estar', 'salón', 'sala principal'];
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
    'libro-colores-recib': ['libro sobre colores', 'libro del arte de colores', 'libro sobre los colores', 'el arte de los colores'],
  },
};

exports.syns = syns;
