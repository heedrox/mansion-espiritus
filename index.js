const {onRequest} = require('firebase-functions/v2/https');
const { data } = require('./app/data/data');
const { ScureApi } = require('./scure-api');

async function apiFunction (request, response) {
    const scureApi = new ScureApi({ data: data['es'], debug: true })
    const result = await scureApi.processUserInput({ 
        intentName: request.body.intentName,
        arg: request.body.arg,
        conv: request.body.conv
    })
    response.json({
        sentence: result.sentence,
        isEnd: result.isEnd,
        conv: result.conv
    })
}

exports.apiv2 = onRequest(apiFunction)
exports.apiAi = onRequest(apiFunction)
