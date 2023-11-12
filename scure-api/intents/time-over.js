const { commands } = require('scure')

const { scureTimeover } = commands

const timeOver =  scure => (conv) => {
  const response = scureTimeover(conv.data, scure);
  conv.close(response.sentence);
};

module.exports = { timeOver }
