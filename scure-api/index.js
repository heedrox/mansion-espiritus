const { cleanData } =require( './lib/common.js')
const { getConv } =require('./lib/conv-repository.js')
const { ScureCliIntentExecutor } = require('./lib/scure-cli-intent-executor.js')

class ScureApi {
  constructor({ data, debug }) {
    this.executor = new ScureCliIntentExecutor(data)    
    this.debug = debug
    this.conv = getConv()
    cleanData(this.conv)
  }

  start() {
    const welcomeResponse = this.executor.executeIntent('_welcome', this.conv, { arg: null })
    return {
      sentence: welcomeResponse.sentence,
      isEnd: false
    }
  }

  async processUserInput({ intentName, arg }) {            
      try {
        if (this.debug) {
          console.log({ intentName, arg })
        }
        if (intentName) {
          const response = this.executor.executeIntent(intentName, this.conv, { arg })
          return {
            sentence: response.sentence,
            isEnd: response.isEnd
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