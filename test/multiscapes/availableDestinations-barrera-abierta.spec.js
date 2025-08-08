const { expect } = require('chai');
const playaSurData = require('../../multiscapes/games-data/playa-sur');

describe('Available Destinations - Barrera Abierta', () => {
    it('should return playa-norte when barreraElectromagneticaAbierta is true', () => {
        // Arrange
        const gameState = {
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        };

        // Act
        const destinations = playaSurData.availableDestinations.getDestinations(gameState);

        // Assert
        expect(destinations).to.be.an('array');
        expect(destinations).to.have.length(1);
        expect(destinations).to.include('playa-norte');
    });

    it('should have correct description for available destinations', () => {
        // Assert
        expect(playaSurData.availableDestinations.description).to.include('barrera electromagnética');
        expect(playaSurData.availableDestinations.description).to.include('playa-norte');
    });
});
