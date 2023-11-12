const { sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scureWelcome } = commands

const welcome =  scure => (conv) => {
  const response = scureWelcome(conv.data, scure);

  return sendResponse(conv, scure, response);
};

module.exports = { welcome }