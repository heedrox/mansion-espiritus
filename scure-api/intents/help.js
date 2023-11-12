const { sendResponse } = require('../lib/common.js')
const { commands } = require('scure')

const { scureHelp } = commands

const helpWithoutMap = scure => (conv) => {
  const response = scureHelp(conv.data, scure);

  return sendResponse(conv, scure, response);
};

// eslint-disable-next-line no-confusing-arrow
const help = scure => conv => helpWithoutMap(scure)(conv);
module.exports = { help }