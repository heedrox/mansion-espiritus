const { getArgument, overwriteDataFrom, sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scureAnswer } = commands

const answer = scure => (conv, args) => {
  const userAnswer = getArgument(args, 'arg');

  const scureResponse = scureAnswer(userAnswer ?? '', conv.data, scure);

  overwriteDataFrom(scureResponse, conv);

  return sendResponse(conv, scure, scureResponse);
};

module.exports = { answer }