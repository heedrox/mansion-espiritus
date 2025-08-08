const { expect } = require('chai');
const DroneResponseGenerator = require('../../multiscapes/domain/DroneResponseGenerator');

describe('Destinations Prompt Integration', () => {
    it('should include destinations section when barrera is closed', () => {
        // Arrange
        const gameState = {
            barreraElectromagneticaAbierta: false,
            currentRoom: 'playa-sur'
        };

        // Act
        const prompt = DroneResponseGenerator._getRoomPrompt('playa-sur', gameState);

        // Assert
        expect(prompt).to.include('# DESTINOS DISPONIBLES:');
        expect(prompt).to.include('Actualmente no puedes ir a ningún lado desde esta ubicación');
        expect(prompt).to.include('barrera electromagnética');
    });

    it('should include playa-norte when barrera is open', () => {
        // Arrange
        const gameState = {
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        };

        // Act
        const prompt = DroneResponseGenerator._getRoomPrompt('playa-sur', gameState);

        // Assert
        expect(prompt).to.include('# DESTINOS DISPONIBLES:');
        expect(prompt).to.include('Puedes ir a los siguientes lugares:');
        expect(prompt).to.include('- playa-norte');
    });

    it('should not include destinations section for rooms without availableDestinations', () => {
        // Arrange
        const gameState = {
            currentRoom: 'non-existent-room'
        };

        // Act
        const prompt = DroneResponseGenerator._getRoomPrompt('non-existent-room', gameState);

        // Assert
        expect(prompt).to.not.include('# DESTINOS DISPONIBLES:');
    });
});
