const { answerCajaFuerte } = require('../../app/plugins/answer-caja-fuerte');

describe('Answer caja fuerte responds when user fails', () => {

  let scure;

  beforeEach(() => {
    scure = buildTestScure();
  });

  it('easter egg when backwards', () => {
    const data = {};
    const userAnswer = '3584';

    const response = answerCajaFuerte(data, scure, userAnswer);

    expect(response).to.equal('No creo que haya que ponerlo al revés. Demasiado rebuscado.');
  });

  it('easter egg when same code as first one', () => {
    const data = {};
    const userAnswer = '6143';

    const response = answerCajaFuerte(data, scure, userAnswer);

    expect(response).to.contains('¿No has oído nunca lo de que un código solo sirve una vez? Venga, dime qué hacemos ahora.');
  });

  it('easter egg when same code as first one backwards', () => {
    const data = {};
    const userAnswer = '3416';

    const response = answerCajaFuerte(data, scure, userAnswer);

    expect(response).to.contains('¿No has oído nunca lo de que un código solo sirve una vez? Venga, dime qué hacemos ahora.');
  });

  it('easter egg when same code as first one backwards', () => {
    const data = {};
    const userAnswer = '999999';

    const response = answerCajaFuerte(data, scure, userAnswer);

    expect(response).to.contains('No, parece que ese código no es');
  });

});
