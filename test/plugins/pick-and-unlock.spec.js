const { stateIsUnlocked } = require('scure').lib;
const { pickAndUnlock } = require('../../app/plugins/pick-and-unlock');

describe('Combined actions', () => {

  let scure;

  beforeEach(() => {
    scure = buildTestScure();
  });

  it('executes one action', () => {
    const data = { roomId: 'recibidor' };
    const userAnswer = '2879';

    const response = pickAndUnlock('itemid', 'lockid', 'DONE')(data, scure, userAnswer);

    expect(response).to.equal('DONE');
    expect(stateIsUnlocked(data, 'lockid')).to.equal(true);
    expect(data.inventory).to.contains('itemid');
  });

});
