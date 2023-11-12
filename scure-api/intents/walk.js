const { getArgument, overwriteDataFrom } = require('../lib/common.js')
const { commands } = require('scure')
const { sendResponse } = require('../lib/common.js')

const { scureWalk } = commands

const hasValue = x => (typeof x !== 'undefined') && (x!=='');

const getRandom = array => array[Math.floor(Math.random() * array.length)];

const getSoundToAdd = (previousRoom, conv, scure) => {
  const walkingSound = scure.sentences.get('walking-sound');

  if (!hasValue(walkingSound)) return '';
  if (conv.data.roomId === previousRoom) return '';
  return Array.isArray(walkingSound) ? getRandom(walkingSound) : walkingSound;
};

const addWalkingSoundIfRoomChanges = (response, previousRoom, conv, scure) => {
  const soundToAdd = getSoundToAdd(previousRoom, conv, scure);
  response.sentence = soundToAdd + response.sentence;
};

const walk =  scure => (conv, args) => {
  const arg = getArgument(args, 'arg');
  const previousRoom = conv.data.roomId;

  const scureResponse = scureWalk(arg, conv.data, scure);

  overwriteDataFrom(scureResponse, conv);
  addWalkingSoundIfRoomChanges(scureResponse, previousRoom, conv, scure);
  return sendResponse(conv, scure, scureResponse);
};

module.exports = { walk }

