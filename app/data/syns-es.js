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
    'artilugio-dorm': ['artilugio','artilugio con palancas', 'aparato', 'artilugio cuadrado', 'artilugio cuadrado con palancas', 'palancas', 'puerta', 'puerta del infierno', 'infierno', 'inframundo', 'puerta del inframundo', 'puerta infierno', 'puerta inframundo', 'muerte', 'otra dimensión', 'puerta a otra dimensión', 'puerta de la dimensión', 'artilugio del infierno', 'artilugio infernal', 'puerta infernal', 'espíritus', 'otros espíritus'],
    'mural-recib': ['mural', 'mural en la pared', 'mural de la pared', 'cuadro', 'cuadro en pared', 'colores', 'letras'],
    'estanteria-recib': ['estantería', 'biblioteca', 'libros', 'libreria'],
    'libro-espiritus-recib': ['libro sobre espíritus', 'lectura de espíritus', 'libro sobre los espíritus','libro con espíritus', 'el de los espíritus', 'libro de espectros', 'libros de expectros', 'páginas', 'más páginas', 'siguientes páginas'],
    'libro-colores-recib': ['libro sobre colores', 'libro del arte de colores',  'libro de arte de colores', 'libro sobre los colores', 'el arte de los colores', 'páginas', 'más páginas', 'siguientes páginas'],
    'arcon-recib': ['arcón', 'arcón del recibidor', 'arcón en el recibidor', 'baúl', 'baúl en el recibidor', 'caja', 'candado', 'cerradura'],
    '3416': ['3416', 'código 3416', 'combinación 3416', 'código 3416 del recibidor', 'código 3416 en el recibidor', 'código 3416 en el arcón', 'código 3416 en el baúl', 'código 3416 en la caja', 'código 3416 en la cerradura', 'código 3416 en el candado'],
    'escudo-recib': ['escudo del recibidor', 'escudo dentro del arcón', 'escudo del arcón', 'escudo del baúl', 'escudo de dentro del baúl', 'escudo de dentro del arcón'],
    'mesa-recib': ['mesa', 'mesa del recibidor', 'mesa con velas'],
    'hechizo-recib': ['hechizo', 'hechizo para bendecir agua', 'hechizo para agua bendita', 'hechizo para el agua', 'hechizo para bendecir agua', 'hechizo de agua bendita'],
    'chimenea-sala': ['chimenea', 'chimenea del salón', 'chimenea bajo el cuadro', 'chimenea en la sala','chimenea y cuadro', 'chimenea con cuadro'  ],
    'cuadro-sala': ['cuadro', 'cuadro sobre la chimenea', 'cuadro de encima de la chimenea', 'cuadro de encima' ],
    'lobo-sala': ['lobo', 'espíritu', 'fantasma', 'espectro', 'espíritu del lobo', 'espíritu de lobo', 'fantasma del lobo', 'fantasma de lobo', 'lobezno'],
    'espiritu-cocina': ['espíritu', 'espíritu de fuego', 'fantasma de fuego', 'fuego', 'espectro'],
    'vaso-cocina': ['vaso', 'vaso lleno de agua', 'vaso con agua', 'vaso de agua', 'vaso a tope de agua', 'agua'],
    'mesa-cocina': ['mesa', 'mesa de la cocina', 'mesa con vaso de agua', 'mesa del vaso', 'mesa en la cocina', 'mesa de cocina'],
    'armario-cocina': ['armarios', 'armario de la cocina', 'armario en la cocina', 'armario', 'cuchillos', 'cucharas', 'tenedores', 'tenedor', 'cuchillo', 'cuchara', 'cuchillos cucharas y tenedores', 'cuchillos cucharas', 'juegos de cocina', 'juegos', 'cubiertos', 'cubierto', 'juego de cubiertos'],
    'cama-dormitorio': ['cama', 'almohada', 'catre'],
    'yo-sotano': ['tu', 'yo', 'a mi', 'mi', 'a yo', 'humano', 'humano en el suelo', 'hombre', 'mujer', 'persona'],
    'mueble-sotano': ['figuras', 'mueble', 'ciclope', 'humano del mueble', 'persona del mueble', 'hombre en el mueble', 'mesa'],
    'caja-sotano': ['caja fuerte', 'caja', 'cerradura', 'candado', 'combinación'],
    '4853': ['4853', 'código 4853', 'combinación 4853', 'código 4853 del sótano', 'código 4853 en el sótano', 'código 4853 en la caja', 'código 4853 en la cerradura', 'código 4853 en la caja fuerte'],
  },
};

exports.syns = syns;
