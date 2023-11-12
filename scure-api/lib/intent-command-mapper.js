const { look, pickup, use, walk } =require('../intents/index.js')
const { dsl } =require('scure')

const { Commands } = dsl

const INTENT_COMMANDS_MAP = new Map([
  [walk, Commands.WALK],
  [look, Commands.LOOK],
  [pickup, Commands.PICKUP],
  [use, Commands.USE],
]);

const byCommand = command => intent => INTENT_COMMANDS_MAP.get(intent) === command;
const getCommandForIntent = intent => INTENT_COMMANDS_MAP.get(intent);
const getIntentForCommand = command => [...INTENT_COMMANDS_MAP.keys()].find(byCommand(command));

module.exports = {
  getCommandForIntent,
  getIntentForCommand
}