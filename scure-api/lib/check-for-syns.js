const { lib }  = require('scure')
const { getCommandForIntent, getIntentForCommand } = require('./intent-command-mapper.js')
const { getArgument  } = require('../lib/common.js')

const { getCommandSyn } = lib

const checkForSyns = originalIntent => scure => (conv, args) => {
  const argument = getArgument(args, 'arg');
  const command = getCommandForIntent(originalIntent);
  const commandToReplace = getCommandSyn(command, argument, conv.data, scure);
  console.log(commandToReplace, originalIntent,commandToReplace ? 1: 0)
  const updatedIntent = commandToReplace ? getIntentForCommand(commandToReplace) : originalIntent;
  return updatedIntent(scure)(conv, args);
};

module.exports = {
  checkForSyns
}