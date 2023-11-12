const { getArgumentList, overwriteDataFrom, sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scureUse } = commands

const use =  scure => (conv, args) => {
  const items = getArgumentList(args, 'arg');

  const scureResponse = scureUse(items, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);

  return sendResponse(conv, scure, scureResponse);
};

module.exports = { use };