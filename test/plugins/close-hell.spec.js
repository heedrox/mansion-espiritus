const { stateIsUnlocked } = require('scure').lib;
const { closeHell } = require('../../app/plugins/close-hell');

describe('When closing hell', () => {
  let scure;
  let data, response;

  beforeEach(() => {
    scure = buildTestScure();
    data = { roomId: 'dormitorio' };
    response = closeHell('RESPONSE')(data, scure, '');
  });

  it('it changes room to sotano', () => {
    expect(data.roomId).to.equal('sotano');
  });

  it('says response', () => {
    expect(response).to.equal('RESPONSE');
  });

  it('unlocks closed-hell lock', () => {
    expect(stateIsUnlocked(data, 'closed-hell')).to.equal(true);
  });

  it('resets timer to 5 mins', () => {
    expect(scure.getLeftTimeFrom(data.startTime)).equals('10 minutos y 0 segundos');
  });
});
