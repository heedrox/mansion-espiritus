const { getArgument } = require('../lib/common.js')

const say = scure => (conv, args) => {
  const text = getArgument(args, 'arg');

  return {
    sentence: text,
    isEnd: false,
    conv
  }
};

module.exports = { say }