const c = require('scure-dialogflow').sdk.dsl.aCommand;
const { runWalkthrough } = require('scure-dialogflow').sdk;
const { data } = require('../data/data-es');

const commands = [
  c('_welcome', ''),
  c('look', ''),
  c('walk', ''),
];

try {
  runWalkthrough(data, commands);
} catch (ex) {
  console.log('error', ex);
  throw ex;
}


