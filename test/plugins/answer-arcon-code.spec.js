const { answerArconCode } = require('../../app/plugins/answer-arcon-code');

describe('Answer arcon code responds when user fails', () => {

  let scure;

  beforeEach(() => {
    scure = buildTestScure();
  });

  it('responds ordinary text when ordinary answer', () => {
    const data = {};
    const userAnswer = '2879';

    const response = answerArconCode(data, scure, userAnswer);

    expect(response).to.equal('No, ese número no abre el baúl.');
  });

  it('responds help sentence when answer is almost correct (and backwards)', () => {
    const data = {};
    const userAnswer = '6143';

    const response = answerArconCode(data, scure, userAnswer);

    expect(response).to.contains('Pero me pregunto si las letras');
  });


});
