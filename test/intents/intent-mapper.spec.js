const { intentMapper } = require('../../app/intents/intent-mapper');

describe('Intent Mapper', () => {

  let scure;

  beforeEach(() => {
    scure = buildTestScure();
  });

  it('translates "sigue leyendo" into FALLBACK when not in recibidor', () => {
    const conv = {
      body: { queryResult: { queryText: 'sigue leyendo' } },
      data: { roomId: 'cocina' },
    };
    const args = {};

    const intent = intentMapper(scure, conv, args, () => {});

    expect(intent.name).to.equal('look');
    expect(args['arg']).to.equal('libro');
  });

  describe('when in recibidor', () => {
    it('translates "sigue leyendo" into LOOK ESTANTERIA when not lastItem', () => {
      const conv = {
        body: { queryResult: { queryText: 'sigue leyendo' } },
        data: { roomId: 'recibidor' },
      };
      const args = {};

      const intent = intentMapper(scure, conv, args, () => {});

      expect(intent.name).to.equal('look');
      expect(args['arg']).to.equal('estanteria');
    });

    it('translates "sigue leyendo" into LOOK libro sobre espíritus when lastItem is libro sobre espiritus', () => {
      const conv = {
        body: { queryResult: { queryText: 'sigue leyendo' } },
        data: { roomId: 'recibidor', lastItem: 'libro-espiritus-recib' },
      };
      const args = {};

      const intent = intentMapper(scure, conv, args, () => {});

      expect(intent.name).to.equal('use');
      expect(args['arg']).to.equal('libro sobre espíritus');
    });

    it('translates "sigue leyendo" into LOOK libro sobre colores when lastItem is libro sobre colores', () => {
      const conv = {
        body: { queryResult: { queryText: 'sigue leyendo' } },
        data: { roomId: 'recibidor', lastItem: 'libro-colores-recib' },
      };
      const args = {};

      const intent = intentMapper(scure, conv, args, () => {});

      expect(intent.name).to.equal('use');
      expect(args['arg']).to.equal('libro sobre colores');
    });
  });

});
