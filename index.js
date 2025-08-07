const {onRequest} = require('firebase-functions/v2/https');
const { data } = require('./app/data/game-1/data');
const { ScureApi } = require('./scure-api');
const { GptTextParser } = require('./scure-api/parser/gpt-text-parser')
const { multiscapes, multiscapesInit, multiscapesTest } = require('./multiscapes')
require('dotenv').config()

const gptParser = new GptTextParser(process.env.OPEN_AI_KEY)

async function aiFunction (request, response) {
    // Configurar headers CORS
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar la solicitud OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }

    const { text, conv, language, summary, gameId } = request.body
    const gameIdRequired = gameId ? gameId : '1'
    const { data } = require(`./app/data/game-${gameIdRequired}/data`)
    if (!text || !conv || !language) {
        response.status(400).send(`Faltan datos en ${JSON.stringify(request.body)}`)
        return
    }
    const localizedData = language ? data[language] : data['es']
    console.log('request', request.body)
    const { intentName, arg, summary: summaryResponse } = await gptParser.parse(text, conv.previousConversation, summary)
    const scureApi = new ScureApi({ data: localizedData, debug: true })
    const result = await scureApi.processUserInput({ 
        intentName,
        arg,
        conv
    })
    const newConv = addConversation(text, result.sentence, result.conv)
    response.json({
        sentence: result.sentence,
        isEnd: result.isEnd,
        conv: newConv,
        summary: summaryResponse ? summaryResponse : summary
    })
}

const addConversation = (text, sentence, conv) => {
    return {
        previousConversation: [
            ...conv.previousConversation,
            { user: 'USER', sentence: text },
            { user: 'DRON', sentence: sentence }
        ],
        data: conv.data
    }
}

exports.apiAi = onRequest(aiFunction)
exports.multiscapes = onRequest(multiscapes)
exports.multiscapesInit = onRequest(multiscapesInit)
exports.multiscapesTest = onRequest(multiscapesTest)