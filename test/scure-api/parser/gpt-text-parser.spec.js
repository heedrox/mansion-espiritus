const { GptTextParser } = require("../../../scure-api/parser/gpt-text-parser.js")
require('dotenv').config()

const OPEN_AI_KEY = process.env.OPEN_AI_KEY

describe('Gpt Text parser', () => {

    it('parses an empty text', async () => {
        const parser = new GptTextParser(OPEN_AI_KEY)
        const response = await parser.parse('')

        expect(response).to.equal({})
    })
    it('parses a text with gpt', async () => {
        const parser = new GptTextParser(OPEN_AI_KEY)
        const response = await parser.parse('mirar habitación')

        expect(response).to.equal({ intentName: 'look', arg: ['habitación'] })
    })
    it('has context', async () => {
        const parser = new GptTextParser(OPEN_AI_KEY)

        const conversation = [
            ({ user: 'DRON', sentence: 'dime que hacemos' }),
            ({ user: 'USER', sentence: 'mira el mural' }),
            ({ user: 'DRON', sentence: 'es un mural' })
        ]
        const response = await parser.parse('vuelve a mirarlo', conversation)

        expect(response).to.equal({ intentName: 'look', arg: ['mural'] })
    })
})