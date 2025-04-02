const { GptTextParser } = require("../../../scure-api/parser/gpt-text-parser.js")
require('dotenv').config()

const OPEN_AI_KEY = process.env.OPEN_AI_KEY

describe('Gpt Text parser', () => {

    it('parses an empty text', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(OPEN_AI_KEY)
        const response = await parser.parse('')

        expect(response).to.deep.equal({})
    })
    it('parses a text with gpt', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(OPEN_AI_KEY)
        const response = await parser.parse('mirar habitación')

        expect(response).to.deep.equal({ intentName: 'look', arg: ['habitación'] })
    })
    it('has context', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(OPEN_AI_KEY)

        const conversation = [
            ({ user: 'DRON', sentence: 'dime que hacemos' }),
            ({ user: 'USER', sentence: 'mira el mural' }),
            ({ user: 'DRON', sentence: 'es un mural' })
        ]
        const response = await parser.parse('vuelve a mirarlo', conversation)

        expect(response).to.deep.equal ({ intentName: 'look', arg: ['mural'] })
    })

    it('starts the adventure', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(OPEN_AI_KEY)
        const response = await parser.parse('START_ADVENTURE', [])

        expect(response).to.deep.equal ({ intentName: '_welcome', arg: [] })
    })
})