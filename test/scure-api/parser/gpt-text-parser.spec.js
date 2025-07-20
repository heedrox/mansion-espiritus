const { GptTextParser } = require("../../../scure-api/parser/gpt-text-parser.js")
require('dotenv').config()
const { expect } = require('chai')

const PROVIDER_API_KEY = process.env.OPEN_AI_KEY

xdescribe('Gpt Text parser', () => {

    it('parses an empty text', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(PROVIDER_API_KEY)
        const response = await parser.parse('')

        expect(response).to.deep.equal({})
    })
    it('parses a text with gpt', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(PROVIDER_API_KEY)
        const response = await parser.parse('mirar habitación')

        expect(response.intentName).to.equal('look')
        expect(response.arg).to.deep.equal(['habitación'])
        expect(response.summary).to.be.a('string')
    })
    it('has context', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(PROVIDER_API_KEY)

        const conversation = [
            ({ user: 'DRON', sentence: 'dime que hacemos' }),
            ({ user: 'USER', sentence: 'mira el mural' }),
            ({ user: 'DRON', sentence: 'es un mural' })
        ]
        const response = await parser.parse('vuelve a mirarlo', conversation)

        expect(response.intentName).to.equal('look')
        expect(response.arg).to.deep.equal(['mural'])
        expect(response.summary).to.be.a('string')
    })

    it('starts the adventure', async function () {
        this.timeout(20000)
        const parser = new GptTextParser(PROVIDER_API_KEY)
        const response = await parser.parse('START_ADVENTURE', [])

        expect(response.intentName).to.equal('_welcome')
        expect(response.arg).to.deep.equal([])
        expect(response.summary).to.be.a('string')
    })
})