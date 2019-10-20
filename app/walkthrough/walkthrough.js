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
];

try {
  runWalkthrough(data, commands);
} catch (ex) {
  console.log('error', ex);
  throw ex;
}


