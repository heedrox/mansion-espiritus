const { getArgument, overwriteDataFrom, sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scurePickup } = commands


const pickup =  scure => (conv, args) => {
  const itemName = getArgument(args, 'arg');

  const scureResponse = scurePickup(itemName, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  return sendResponse(conv, scure, scureResponse);
};

module.exports = { pickup }