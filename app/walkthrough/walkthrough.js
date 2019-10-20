const c = require('scure-dialogflow').sdk.dsl.aCommand;
const { runWalkthrough } = require('scure-dialogflow').sdk;
const { data } = require('../data/data-es');

const commands = [
  c('_welcome', ''),
  c('look', ''),
  c('walk', ''),
  c('walk', 'dormitorio'),
  c('look', 'artilugio'),
  c('use', 'palancas'),
  c('walk', 'recibidor'),
  c('look', 'mural'),
  c('look', 'estantería'),
  c('use', '', 'sigue leyendo'),
  c('look', 'libro del arte de los colores'),
  c('use', '', 'sigue leyendo'),
  c('use', '', 'sigue leyendo'),
  c('use', '', 'sigue leyendo'),
  c('pickup', 'arcon'),
  c('use', 'candado'),
  c('answer', '', '2489'),
  c('answer', '', '6143'),
  c('look', 'mural'),
  c('use', 'candado'),
  c('answer', '', '3416'),
  c('look', 'escudo'),
  c('walk', 'sala de estar'),
  c('look', 'chimenea bajo el cuadro'),
  c('look', 'cuadro de encima'),
  c('look', 'lobo'),
  c('use', 'cuadro'),
  c('use', 'chimenea'),
  c('use', ['lobo', 'escudo']),
  c('use', 'lobo'),
  c('look', ''),
  c('look', 'cuadro'),
  c('walk', 'recibidor'),
  c('look', 'libros'),
  c('look', 'libro de espíritus'),
  c('use', 'libro de espíritus'),
  c('use', '', 'sigue leyendo'),
  c('use', '', 'sigue leyendo'),
  c('look', 'hechizo para bendecir agua'),
  c('look', 'mesa'),
  c('walk', 'cocina'),
  c('look', 'mesa'),
  c('pickup', 'vaso'),
  c('use', ['espíritu']),
  c('use', ['agua', 'espíritu']),
  c('use', ['agua', 'hechizo']),
  c('use', ['agua', 'espíritu']),
  c('use', ['espíritu']),
  c('look', 'mesa'),
  c('look', 'armarios'),
  c('use', 'armario de la cocina'),
  c('walk', 'recibidor'),
  c('walk', 'dormitorio'),
  c('look', 'cama'),
  c('use', 'cama'),
  c('use', 'palancas'),
  c('look', ''),
  c('look', 'a mi'),
  c('walk', 'dormitorio'),
  c('walk', 'sotano'),
  c('look', 'caja'),

];

try {
  runWalkthrough(data, commands);
} catch (ex) {
  console.log('error', ex);
  throw ex;
}


