const {onRequest} = require('firebase-functions/v2/https');
const { data } = require('./app/data/data');
const { ScureApi } = require('./scure-api');
const { GptTextParser } = require('./scure-api/parser/gpt-text-parser')
require('dotenv').config()

const gptParser = new GptTextParser(process.env.openAiKey)

async function aiFunction (request, response) {
    const { text, conv, language } = request.body
    const localizedData = language ? data[language] : data['es']
    const { intentName, arg } = await gptParser.parse(text, conv.previousConversation)
    const scureApi = new ScureApi({ data: localizedData, debug: true })
    const result = await scureApi.processUserInput({ 
        intentName,
        arg,
        conv
    })
    response.json({
        sentence: result.sentence,
        isEnd: result.isEnd,
        conv: result.conv
    })
}

console.log('env', process.env)

exports.apiAi = onRequest(aiFunction)
