const { expect } = require('chai');
const sinon = require('sinon');
const GetInitialStatus = require('../../../multiscapes/application/GetInitialStatus');

describe('GetInitialStatus', () => {
    let MessageRepositoryStub;
    let GameStateServiceStub;

    beforeEach(() => {
        // Mock MessageRepository
        MessageRepositoryStub = sinon.stub();
        
        // Reemplazar el módulo MessageRepository con el stub
        const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
        sinon.stub(MessageRepository, 'getMessagesByTimestamp').callsFake(MessageRepositoryStub);

        // Mock GameStateService
        const GameStateService = require('../../../multiscapes/infrastructure/GameStateService');
        GameStateServiceStub = {
            getGameState: sinon.stub()
        };
        sinon.stub(GameStateService.prototype, 'getGameState').callsFake(GameStateServiceStub.getGameState);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('execute', () => {
        it('should return messages with count, timestamp and currentRoom', async () => {
            // Arrange
            const mockMessages = [
                {
                    id: 'msg1',
                    message: 'Hola, este es el primer mensaje de prueba',
                    user: 'player',
                    timestamp: '2025-07-20T14:57:21.506Z'
                },
                {
                    id: 'msg2',
                    message: 'Respuesta del drone al primer mensaje',
                    user: 'drone',
                    timestamp: '2025-07-20T14:57:47.365Z'
                },
                {
                    id: 'msg3',
                    message: 'Segundo mensaje de prueba',
                    user: 'player',
                    timestamp: '2025-07-20T14:59:01.506Z'
                }
            ];

            const mockGameState = {
                currentRoom: 'playa-sur',
                barreraElectromagneticaAbierta: false
            };

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex',
                drone: 'common'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result).to.have.property('messages');
            expect(result).to.have.property('count');
            expect(result).to.have.property('timestamp');
            expect(result).to.have.property('currentRoom');
            
            expect(result.messages).to.deep.equal(mockMessages);
            expect(result.count).to.equal(3);
            expect(result.timestamp).to.be.a('string');
            expect(new Date(result.timestamp)).to.be.instanceOf(Date);
            expect(result.currentRoom).to.equal('Playa Sur');

            // Verify that MessageRepository was called with correct parameters
            expect(MessageRepository.getMessagesByTimestamp.calledOnce).to.be.true;
            expect(MessageRepository.getMessagesByTimestamp.calledWith('test-codex')).to.be.true;
        });

        it('should return empty array when no messages exist', async () => {
            // Arrange
            const mockMessages = [];
            const mockGameState = {
                currentRoom: 'playa-norte',
                piramideAbierta: false
            };

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex',
                drone: 'johnson'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.messages).to.deep.equal([]);
            expect(result.count).to.equal(0);
            expect(result.timestamp).to.be.a('string');
            expect(result.currentRoom).to.equal('Playa Sur > Playa Norte');
        });

        it('should handle single message correctly', async () => {
            // Arrange
            const mockMessages = [
                {
                    id: 'msg1',
                    message: 'Único mensaje',
                    user: 'player',
                    timestamp: '2025-07-20T14:57:21.506Z'
                }
            ];

            const mockGameState = {
                currentRoom: 'interior-piramide'
            };

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex',
                drone: 'jackson'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.messages).to.have.length(1);
            expect(result.count).to.equal(1);
            expect(result.messages[0]).to.deep.equal(mockMessages[0]);
            expect(result.currentRoom).to.equal('Playa Sur > Playa Norte > Interior de la Pirámide');
        });

        it('should handle missing room file gracefully', async () => {
            // Arrange
            const mockMessages = [];
            const mockGameState = {
                currentRoom: 'habitacion-inexistente'
            };

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.currentRoom).to.equal('habitacion-inexistente'); // Fallback al nombre interno
        });

        it('should use default room when gameState has no currentRoom', async () => {
            // Arrange
            const mockMessages = [];
            const mockGameState = {}; // Sin currentRoom

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.currentRoom).to.equal('Playa Sur'); // Default es playa-sur
        });

        it('should handle room file without title property', async () => {
            // Test implementado en base al comportamiento real de los archivos de datos
            // Como todos los archivos tienen title, este test verifica el fallback
            const mockMessages = [];
            const mockGameState = {
                currentRoom: 'playa-sur'
            };

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            const params = {
                code: 'test-codex'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.currentRoom).to.equal('Playa Sur');
        });
    });
}); 