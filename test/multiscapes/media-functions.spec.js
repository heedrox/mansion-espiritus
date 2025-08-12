const { expect } = require('chai');
const path = require('path');

describe('Media como Funciones con gameState', () => {
  let interiorPiramideData;
  let playaNorteData;
  let playaSurData;

  before(() => {
    // Cargar los datos de los archivos games-data
    const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
    interiorPiramideData = require(path.join(gamesDataDir, 'interior-piramide.js'));
    playaNorteData = require(path.join(gamesDataDir, 'playa-norte.js'));
    playaSurData = require(path.join(gamesDataDir, 'playa-sur.js'));
  });

  describe('interior-piramide.js', () => {
    it('debe tener media como función que acepta gameState', () => {
      expect(typeof interiorPiramideData.media).to.equal('function');
    });

    it('debe retornar array de media items', () => {
      const gameState = {};
      const mediaItems = interiorPiramideData.media(gameState);
      expect(Array.isArray(mediaItems)).to.be.true;
    });

    it('debe mostrar estatuas siempre', () => {
      const gameState = {};
      const mediaItems = interiorPiramideData.media(gameState);
      const estatuasItem = mediaItems.find(item => item.title === 'Estatuas');
      expect(estatuasItem).to.exist;
    });

    it('debe mostrar puerta de salida solo si las estatuas están iluminadas', () => {
      // Sin estatuas iluminadas
      const gameStateSinIluminar = { estatuasIluminadas: false };
      const mediaItemsSinIluminar = interiorPiramideData.media(gameStateSinIluminar);
      const puertaSalidaSinIluminar = mediaItemsSinIluminar.find(item => item.title === 'Puerta de salida');
      expect(puertaSalidaSinIluminar).to.not.exist;

      // Con estatuas iluminadas
      const gameStateConIluminar = { estatuasIluminadas: true };
      const mediaItemsConIluminar = interiorPiramideData.media(gameStateConIluminar);
      const puertaSalidaConIluminar = mediaItemsConIluminar.find(item => item.title === 'Puerta de salida');
      expect(puertaSalidaConIluminar).to.exist;
    });
  });

  describe('playa-norte.js', () => {
    it('debe tener media como función que acepta gameState', () => {
      expect(typeof playaNorteData.media).to.equal('function');
    });

    it('debe retornar array de media items', () => {
      const gameState = {};
      const mediaItems = playaNorteData.media(gameState);
      expect(Array.isArray(mediaItems)).to.be.true;
    });

    it('debe mostrar símbolos en el árbol siempre', () => {
      const gameState = {};
      const mediaItems = playaNorteData.media(gameState);
      const arbolItem = mediaItems.find(item => item.title === 'Símbolos en el árbol');
      expect(arbolItem).to.exist;
    });
  });

  describe('playa-sur.js', () => {
    it('debe tener media como función que acepta gameState', () => {
      expect(typeof playaSurData.media).to.equal('function');
    });

    it('debe retornar array de media items', () => {
      const gameState = {};
      const mediaItems = playaSurData.media(gameState);
      expect(Array.isArray(mediaItems)).to.be.true;
    });

    it('debe mostrar acantilado siempre', () => {
      const gameState = {};
      const mediaItems = playaSurData.media(gameState);
      const acantiladoItem = mediaItems.find(item => item.title === 'Detalle del acantilado');
      expect(acantiladoItem).to.exist;
    });
  });

  describe('Integración con PromptGenerator', () => {
    it('debe poder llamar a media(gameState) sin errores', () => {
      const gameState = { piramideAbierta: true, estatuasIluminadas: false };
      
      // Verificar que no hay errores al llamar a las funciones media
      expect(() => interiorPiramideData.media(gameState)).to.not.throw();
      expect(() => playaNorteData.media(gameState)).to.not.throw();
      expect(() => playaSurData.media(gameState)).to.not.throw();
    });
  });
});
