const {onRequest} = require('firebase-functions/v2/https');
const { data } = require('./app/data/data');
const { ScureApi } = require('./scure-api');
const { GptTextParser } = require('./scure-api/parser/gpt-text-parser')
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

    const { text, conv, language } = request.body
    const localizedData = language ? data[language] : data['es']
    const { intentName, arg } = await gptParser.parse(text, conv.previousConversation)
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
        conv: newConv
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
