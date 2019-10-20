const { stateUnlock } = require('scure').lib;

exports.closeHell = (response) => (data, scure, userAnswer) => {
  data.roomId = 'sotano';
  stateUnlock(data, 'closed-hell');
  return response;
};
