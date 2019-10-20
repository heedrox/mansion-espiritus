const { stateUnlock } = require('scure').lib;

const addToInventory = (data, itemId) => {
  data.inventory = data.inventory || [];
  data.inventory.push(itemId);
  data.picked = data.picked || [];
  data.picked.push(itemId);
  return data;
};

exports.pickAndUnlock = (itemid, lock, response) => (data, scure, userAnswer) => {
  addToInventory(data, itemid);
  stateUnlock(data, lock);
  return response;
};
