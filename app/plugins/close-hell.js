const { stateUnlock } = require('scure').lib;

const setTimeToMinutes = (minutes, data, scure) => {
  const simulatedTime = new Date((new Date().getTime()/1000 - ((scure.getInit().totalMinutes - 5) * 60))*1000);
  data.startTime = JSON.stringify(simulatedTime);
};

exports.closeHell = (response) => (data, scure, userAnswer) => {
  data.roomId = 'sotano';
  setTimeToMinutes(5, data, scure);
  stateUnlock(data, 'closed-hell');
  return response;
};
