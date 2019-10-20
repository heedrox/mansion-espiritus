const { getIntentForCommand } = require('scure-dialogflow').lib;
const { Commands } = require('scure').dsl;

const theCommand = (command, arg, args) => {
  args['arg'] = arg;
  return getIntentForCommand(command);
};

const keepReadingIntent = (args, data) => {
  if (data.roomId !== 'recibidor') {
    return theCommand(Commands.LOOK, 'libro', args);
  }
  if (data.lastItem === 'libro-espiritus-recib') {
    return theCommand(Commands.USE, 'libro sobre espíritus', args);
  }
  if (data.lastItem === 'libro-colores-recib') {
    return theCommand(Commands.USE, 'libro sobre colores', args);
  }
  return theCommand(Commands.LOOK, 'estanteria', args);
};

exports.keepReadingIntent = keepReadingIntent;
