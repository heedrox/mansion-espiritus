const { queryGpt } = require('./query-gpt')

class GptTextParser {
    constructor(openAiKey) {
        this.openAiKey = openAiKey
    }

    async parseWithGpt(text, conversation) {        
        try {
            return await queryGpt(text, conversation, this.openAiKey)
        } catch(error) {
            console.log('error', error)
            return {
                intentName: "say",
                arg: [ text ],
                error
            }
        }
        
    }

    async parse(text, conversation = []) {
        return text ? this.parseWithGpt(text, conversation.length >= 6 ? conversation.slice(-6,-1) : conversation ) : {}
    }
}

module.exports = { GptTextParser };