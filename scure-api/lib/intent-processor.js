const { fallback, timeOver } = require('../intents/index.js')
const { commands } = require('scure')
const { isTimeOver } = require('./common.js')

const { scureInitializeState } = commands

const isBeginning = (scure, conv) => conv.data.numCommands < scure.getInit().welcome.length;
const getIntentToUse = (scure, conv, args, intentFunction) => {
  if (isBeginning(scure, conv)) {
    return fallback;
  } else if (isTimeOver(conv.data, scure)) {
    return timeOver;
  } 
  return intentFunction;
};

const intentProcessor = scure => intentFunction => (conv, args) => {
  // eslint-disable-next-line no-console
  conv.data = scureInitializeState(scure, conv.data);
  console.log(intentFunction)
  const intentToUse = getIntentToUse(scure, conv, args, intentFunction);
  return intentToUse(scure)(conv, args);
};


module.exports = {
  intentProcessor
}