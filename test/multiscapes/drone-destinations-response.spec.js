const { expect } = require('chai');
const playaSurData = require('../../multiscapes/games-data/playa-sur');

describe('Drone Destinations Response', () => {
    it('should return empty destinations when barrera is closed', () => {
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

    it('should return playa-norte when barrera is open', () => {
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

    it('should have correct description', () => {
        // Assert
        expect(playaSurData.availableDestinations.description).to.include('barrera electromagnética');
        expect(playaSurData.availableDestinations.description).to.include('playa-norte');
    });
});
