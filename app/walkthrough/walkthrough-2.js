require('./register.js');

const { data } = require('../data/game-2/data-es');
const { createConversation } = require('../../scure-api/lib/conv-repository.js')
const { ScureCliIntentExecutor } = require('../../scure-api/lib/scure-cli-intent-executor.js')

const c = (intentName, arg, expectedEnd = false) =>
({ intentName, arg, expectedEnd })

const commands = [
  c('_welcome', ''),
  c('look', ''),
  c('look', 'pedestal'),
  c('look', 'gema')
  //c('look', 'antorcha'),
  //c('pickup', 'antorcha'),
  

//  c('use', ['puerta', 'llave'], true),

];

try {
  const executor = new ScureCliIntentExecutor(data)
  const conv = createConversation()
  commands.forEach(({ intentName, arg, expectedEnd }) => {
    console.log('-- command', { intentName, arg })
    const response = executor.executeIntent(intentName, conv, { arg })
    console.log('response: ', response.sentence)
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


