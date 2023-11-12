const functions = require('firebase-functions');
const { app } = require('scure-dialogflow');
const { data } = require('./app/data/data');
const { ScureApi } = require('./scure-api');

const appData = app(data['es']);

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

exports.dflow = functions.https.onRequest(appData);
exports.api = functions.https.onRequest(apiFunction)
