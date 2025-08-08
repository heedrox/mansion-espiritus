const { expect } = require('chai');
const playaSurData = require('../../multiscapes/games-data/playa-sur');

describe('Available Destinations - Barrera Cerrada', () => {
    it('should return empty destinations when barreraElectromagneticaAbierta is false', () => {
        // Arrange
        const gameState = {
            barreraElectromagneticaAbierta: false,
            currentRoom: 'playa-sur'
        };

        // Act
        const destinations = playaSurData.availableDestinations.getDestinations(gameState);

        // Assert
        expect(destinations).to.be.an('array');
        expect(destinations).to.have.length(0);
    });

    it('should have availableDestinations property with correct structure', () => {
        // Assert
        expect(playaSurData).to.have.property('availableDestinations');
        expect(playaSurData.availableDestinations).to.have.property('getDestinations');
        expect(playaSurData.availableDestinations).to.have.property('description');
        expect(typeof playaSurData.availableDestinations.getDestinations).to.equal('function');
        expect(typeof playaSurData.availableDestinations.description).to.equal('string');
    });
});
