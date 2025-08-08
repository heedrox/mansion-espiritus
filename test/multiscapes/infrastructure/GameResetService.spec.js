const { expect } = require('chai');
const GameResetService = require('../../../multiscapes/infrastructure/GameResetService');
const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
const GameStateService = require('../../../multiscapes/infrastructure/GameStateService');

describe('GameResetService', () => {
    let resetService;
    const testCode = 'test-reset-code';

    beforeEach(() => {
        resetService = new GameResetService();
    });

    describe('resetGame', () => {
        it('should reset game successfully', async function() {
            // Skip if no emulator connection
            if (!process.env.FIRESTORE_EMULATOR_HOST) {
                this.skip();
            }

            // Arrange
            console.log(`🧪 Testing reset for code: ${testCode}`);

            // Act
            const result = await resetService.resetGame(testCode);

            // Assert
            expect(result).to.equal(true);

            // Verify that the document exists with initial state
            const gameStateService = new GameStateService(testCode);
            const gameState = await gameStateService.getGameState();
            expect(gameState.barreraElectromagneticaAbierta).to.be.false;
            expect(gameState.start).to.equal('1');
            expect(gameState.currentRoom).to.equal('playa-sur');

            // Verify that introduction message exists
            const messages = await MessageRepository.getMessagesByTimestamp(testCode);
            expect(messages).to.be.an('array');
            expect(messages.length).to.be.greaterThan(0);
            
            const introMessage = messages[0];
            expect(introMessage).to.exist;
            expect(introMessage.user).to.equal('drone');
            expect(introMessage.message).to.include('Dron Johnson');
            expect(introMessage.message).to.include('Islas Gemelas');

            console.log('✅ Game reset test completed successfully');
        });

        it('should handle reset of non-existent game', async function() {
            // Skip if no emulator connection
            if (!process.env.FIRESTORE_EMULATOR_HOST) {
                this.skip();
            }

            // Arrange
            const nonExistentCode = 'non-existent-reset-code';

            // Act
            const result = await resetService.resetGame(nonExistentCode);

            // Assert
            expect(result).to.equal(true);

            // Verify that the document was created
            const gameStateService = new GameStateService(nonExistentCode);
            const gameState = await gameStateService.getGameState();
            expect(gameState.barreraElectromagneticaAbierta).to.be.false;

            console.log('✅ Non-existent game reset test completed successfully');
        });
    });
});
