require('./register');

const { data } = require('../data/data-es');
const { createConversation } = require('../../scure-api/lib/conv-repository.js')
const { ScureCliIntentExecutor } = require('../../scure-api/lib/scure-cli-intent-executor.js')

const c = (intentName, arg, expectedEnd = false) =>
({ intentName, arg, expectedEnd })

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
  c('use', 'libro del arte de los colores'),
  c('use', 'libro del arte de los colores'),
  c('use', 'libro del arte de los colores'),
  c('use', 'libro del arte de los colores'),
  c('use', 'libro del arte de los colores'),
  c('pickup', 'arcon'),
  c('use', 'candado'),
  c('answer', ['2489']),
  c('answer', ['6143']),
  c('look', 'mural'),
  c('use', 'candado'),
 // c('answer', ['3416']),
  c('use', ['candado','3416']),
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
  c('use', 'libro de espíritus'),
  c('use', 'libro de espíritus'),
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
  c('walk', 'dormitorio'),
  c('look', 'cama'),
  c('use', 'cama'),
  c('use', 'palancas'),
  c('look', ''),
  c('look', 'a mi'),
  c('walk', 'dormitorio'),
  c('look', 'artilugio'),
  c('walk', 'sotano'),
  c('look', 'caja'),
  c('answer', ['6143']),
  c('answer', ['3416']),
  c('answer', ['9999']),
  c('answer', ['3584']),
  // c('answer', ['4853']),
  c('use', ['caja', '4853']),
  c('look', 'puerta'),
  c('use', 'puerta'),
  c('use', ['puerta', 'llave'], true),

];

try {
  const executor = new ScureCliIntentExecutor(data)
  const conv = createConversation()
  commands.forEach(({ intentName, arg, expectedEnd }) => {
    console.log('data', conv.data);
    console.log('command', { intentName, arg })
    const response = executor.executeIntent(intentName, conv, { arg })
    console.log('response', response)
    if (expectedEnd && response.isEnd) {
      console.log('*** FINAL SCENE, EVERYTHING CORRECT ***')
    } else if (expectedEnd && !response.isEnd) {
      console.log('*** WRONG. EXPECTED END, BUT WE DID NOT REACH IT ***')
    }
  })

} catch (ex) {
  console.log('error', ex);
  throw ex;
}


