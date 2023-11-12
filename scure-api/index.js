const { cleanData } =require( './lib/common.js')
const { createConversation } =require('./lib/conv-repository.js')
const { ScureCliIntentExecutor } = require('./lib/scure-cli-intent-executor.js')

class ScureApi {
  constructor({ data, debug }) {
    this.executor = new ScureCliIntentExecutor(data)    
    this.debug = debug
  }

  async processUserInput({ intentName, arg, conv }) {            
      try {
        if (this.debug) {
          console.log({ intentName, arg })
        }
        if (intentName) {
          const response = this.executor.executeIntent(intentName, conv ? conv : cleanData(createConversation()), { arg })
          return {
            sentence: response.sentence,
            isEnd: response.isEnd,
            conv: response.conv
          }
        }
      } catch (error) {
        console.error('Hubo un error procesando la petición. ', error)
        
      }      
      return {
        sentence: 'Eso no está dentro de mis ámbitos de programación. He crasheado. ¿Puedes reintentarlo?',
        isEnd: false
      }
  }
  
}


module.exports = {
  ScureApi
}