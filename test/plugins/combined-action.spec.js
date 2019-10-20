const { combinedAction } = require('../../app/plugins/combined-action');

describe('Combined actions', () => {

  let scure;

  beforeEach(() => {
    scure = buildTestScure();
  });

  it('executes no action', () => {
    const data = {};
    const userAnswer = '2879';

    const response = combinedAction([''])(data, scure, userAnswer);

    expect(response).to.equal('');
  });

  it('executes')

});
