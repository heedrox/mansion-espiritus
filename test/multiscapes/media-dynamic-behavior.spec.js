const { expect } = require('chai');
const path = require('path');

describe('Comportamiento Dinámico de Media con gameState', () => {
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

  describe('interior-piramide.js - Comportamiento Condicional', () => {
    it('debe mostrar solo estatuas y entrada cuando no hay acciones completadas', () => {
      const gameState = { estatuasIluminadas: false };
      const mediaItems = interiorPiramideData.media(gameState);
      
      expect(mediaItems).to.have.length(2);
      expect(mediaItems.find(item => item.title === 'Estatuas')).to.exist;
      expect(mediaItems.find(item => item.title === 'Entrada con antorcha')).to.exist;
      expect(mediaItems.find(item => item.title === 'Puerta de salida')).to.not.exist;
      expect(mediaItems.find(item => item.title === 'Teclado numérico')).to.not.exist;
    });

    it('debe mostrar teclado y puerta de salida cuando las estatuas están iluminadas', () => {
      const gameState = { estatuasIluminadas: true };
      const mediaItems = interiorPiramideData.media(gameState);
      
      expect(mediaItems).to.have.length(4);
      expect(mediaItems.find(item => item.title === 'Teclado numérico')).to.exist;
      expect(mediaItems.find(item => item.title === 'Puerta de salida')).to.exist;
    });
  });

  describe('playa-norte.js - Comportamiento Estático', () => {
    it('debe mostrar siempre los mismos media items independientemente del gameState', () => {
      const gameState1 = { piramideAbierta: false };
      const gameState2 = { piramideAbierta: true };
      
      const mediaItems1 = playaNorteData.media(gameState1);
      const mediaItems2 = playaNorteData.media(gameState2);
      
      // Debe retornar siempre el mismo array
      expect(mediaItems1).to.deep.equal(mediaItems2);
      expect(mediaItems1).to.have.length(3);
      
      // Siempre debe incluir todos los elementos
      expect(mediaItems1.find(item => item.title === 'Símbolos en el árbol')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Caparazón fosilizado')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Teclado de símbolos extraños')).to.exist;
    });
  });

  describe('playa-sur.js - Comportamiento Estático', () => {
    it('debe mostrar siempre los mismos media items independientemente del gameState', () => {
      const gameState1 = { barreraElectromagneticaAbierta: false };
      const gameState2 = { barreraElectromagneticaAbierta: true };
      
      const mediaItems1 = playaSurData.media(gameState1);
      const mediaItems2 = playaSurData.media(gameState2);
      
      // Debe retornar siempre el mismo array
      expect(mediaItems1).to.deep.equal(mediaItems2);
      expect(mediaItems1).to.have.length(5);
      
      // Siempre debe incluir todos los elementos
      expect(mediaItems1.find(item => item.title === 'Mirando al sur')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Mirando al norte')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Detalle del acantilado')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Vista alternativa del acantilado')).to.exist;
      expect(mediaItems1.find(item => item.title === 'Zoom al faro')).to.exist;
    });
  });

  describe('Integración con PromptGenerator', () => {
    it('debe generar prompts diferentes según el estado del juego', () => {
      const PromptGenerator = require('../../multiscapes/domain/PromptGenerator');
      
      // Estado inicial
      const gameStateInicial = { estatuasIluminadas: false };
      const promptInicial = PromptGenerator.getRoomPrompt('interior-piramide', gameStateInicial);
      
      // Estado avanzado
      const gameStateAvanzado = { estatuasIluminadas: true };
      const promptAvanzado = PromptGenerator.getRoomPrompt('interior-piramide', gameStateAvanzado);
      
      // Los prompts deben ser diferentes
      expect(promptInicial).to.not.equal(promptAvanzado);
      
      // El prompt avanzado debe contener más información de media
      expect(promptAvanzado).to.include('Teclado numérico');
      expect(promptAvanzado).to.include('Puerta de salida');
    });
  });
});
