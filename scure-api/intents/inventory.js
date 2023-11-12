const { sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scureInventory } = commands

const inventory =  scure => (conv) => {
  const scureResponse = scureInventory(conv.data, scure);

  return sendResponse(conv, scure, scureResponse);
};

module.exports = { inventory }