const { scure } =require('scure')
const { intentProcessor } =require('./intent-processor.js');
const { checkForSyns } =require('./check-for-syns.js');
const { bye, fallback, help, inventory, look, pickup, use, walk, welcome, answer, say } =require('../intents/index.js');

const { buildScureFor } = scure
 
class ScureCliIntentExecutor {
    constructor(data) {
        const scure = buildScureFor(data);
        this.scure = scure
        const scureIntentProcessor = intentProcessor(scure);
        this.executor = {
            '_fallback' : scureIntentProcessor(fallback),
            '_welcome': scureIntentProcessor(welcome),
            '_default-bye:': scureIntentProcessor(bye),
            'bye': scureIntentProcessor(bye),
            '_exit': scureIntentProcessor(bye),
            'look': scureIntentProcessor(checkForSyns(look)),
            'walk': scureIntentProcessor(checkForSyns(walk)),
            'pickup': scureIntentProcessor(checkForSyns(pickup)),
            'use': scureIntentProcessor(checkForSyns(use)),
            'inventory': scureIntentProcessor(inventory),
            'answer': scureIntentProcessor(answer),
            'help': scureIntentProcessor(help),
            'say':  scureIntentProcessor(say)
        }
    }

    executeIntent(intentName, conv, arg) {
        if (typeof this.executor[intentName] === undefined) {
            return this.executor["_fallback"](conv, arg)
        }
        const response = this.executor[intentName](conv, arg)
        return response
    }
}

module.exports = {
    ScureCliIntentExecutor
}
