const { queryGpt } = require('./query-gpt')

const buildPrompt = (conversation, texto) => 
    (`La conversación anterior ha sido:
    ${conversation.map(({user, sentence}) => `${user}> ${sentence}`).join("\n")}
    
    --- Fin conversación anterior ---
    <COMANDO>${texto}</COMANDO>
    `)
    
class GptTextParser {
    constructor(openAiKey) {
        this.openAiKey = openAiKey
    }

    async parseWithGpt(text, conversation) {        
        try {
            return await queryGpt(buildPrompt(conversation, text), this.openAiKey)
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