const { queryGpt } = require('./query-gpt')

class GptTextParser {
    constructor(providerApiKey) {
        this.providerApiKey = providerApiKey        
    }

    async parseWithGpt(text, conversation, summary) {        
        try {
            return await queryGpt(text, conversation, this.providerApiKey, summary)
        } catch(error) {
            console.log('error', error)
            return {
                intentName: "say",
                arg: [ text ],
                error,
                summary
            }
        }
        
    }

    async parse(text, conversation = [], summary = '') {
        return text ? this.parseWithGpt(text, conversation.length >= 6 ? conversation.slice(-6) : conversation, summary) : {}
    }
}

module.exports = { GptTextParser };