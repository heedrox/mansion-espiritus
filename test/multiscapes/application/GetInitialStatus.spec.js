const { expect } = require('chai');
const sinon = require('sinon');
const GetInitialStatus = require('../../../multiscapes/application/GetInitialStatus');

describe('GetInitialStatus', () => {
    let MessageRepositoryStub;

    beforeEach(() => {
        // Mock MessageRepository
        MessageRepositoryStub = sinon.stub();
        
        // Reemplazar el módulo MessageRepository con el stub
        const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
        sinon.stub(MessageRepository, 'getMessagesByTimestamp').callsFake(MessageRepositoryStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('execute', () => {
        it('should return messages with count and timestamp', async () => {
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

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);

            const params = {
                code: 'codex',
                drone: 'common'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result).to.have.property('messages');
            expect(result).to.have.property('count');
            expect(result).to.have.property('timestamp');
            
            expect(result.messages).to.deep.equal(mockMessages);
            expect(result.count).to.equal(3);
            expect(result.timestamp).to.be.a('string');
            expect(new Date(result.timestamp)).to.be.instanceOf(Date);

            // Verify that MessageRepository was called with correct parameters
            expect(MessageRepository.getMessagesByTimestamp.calledOnce).to.be.true;
            expect(MessageRepository.getMessagesByTimestamp.calledWith('codex', 'common')).to.be.true;
        });

        it('should return empty array when no messages exist', async () => {
            // Arrange
            const mockMessages = [];
            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);

            const params = {
                code: 'codex',
                drone: 'johnson'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.messages).to.deep.equal([]);
            expect(result.count).to.equal(0);
            expect(result.timestamp).to.be.a('string');
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

            const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
            MessageRepository.getMessagesByTimestamp.resolves(mockMessages);

            const params = {
                code: 'codex',
                drone: 'jackson'
            };

            // Act
            const result = await GetInitialStatus.execute(params);

            // Assert
            expect(result.messages).to.have.length(1);
            expect(result.count).to.equal(1);
            expect(result.messages[0]).to.deep.equal(mockMessages[0]);
        });
    });
}); 