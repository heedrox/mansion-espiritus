const { getArgument, overwriteDataFrom, sendResponse } = require( '../lib/common.js')
const { commands } = require('scure')

const { scureLook } = commands

const look = scure => (conv, args) => {
  const itemName = getArgument(args, 'arg');

  const scureResponse = scureLook(itemName, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  return sendResponse(conv, scure, scureResponse);
};

module.exports = { look }