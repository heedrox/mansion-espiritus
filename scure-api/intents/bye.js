const { commands } = require('scure')

const { scureBye } = commands

const bye = scure => (conv) => {
  const response = scureBye(conv.data, scure);
  conv.data = null;
  return {
    sentence: response.sentence,
    isEnd: true
  }
};

module.exports = { bye }