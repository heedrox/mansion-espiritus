import { queryGpt } from "./query-gpt.js"

const buildPrompt = (conversation, texto) => 
    (`La conversación anterior ha sido:
    ${conversation.map(({user, sentence}) => `${user}> ${sentence}`).join("\n")}
    
    --- Fin conversación anterior ---
    <COMANDO>${texto}</COMANDO>
    `)
    
export class GptTextParser {
    constructor(openAiKey) {
        this.openAiKey = openAiKey
    }

    async parseWithGpt(text, conversation) {
        const response = await queryGpt(buildPrompt(conversation, text), this.openAiKey)
        try {
            return JSON.parse(response)
        } catch(_) {
            return {
                intentName: "say",
                arg: [ response ]
            }
        }
        
    }

    async parse(text, conversation = []) {
        return text ? this.parseWithGpt(text, conversation.length >= 6 ? conversation.slice(-6,-1) : conversation ) : {}
    }
}