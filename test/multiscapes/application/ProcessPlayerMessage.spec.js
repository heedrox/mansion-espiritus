const { expect } = require('chai');
const sinon = require('sinon');
const ProcessPlayerMessage = require('../../../multiscapes/application/ProcessPlayerMessage');
const DroneResponseGenerator = require('../../../multiscapes/domain/DroneResponseGenerator');
const MessageRepository = require('../../../multiscapes/infrastructure/MessageRepository');
const DroneDataService = require('../../../multiscapes/infrastructure/DroneDataService');
const MessageStorer = require('../../../multiscapes/infrastructure/MessageStorer');

describe('ProcessPlayerMessage', () => {
    let DroneResponseGeneratorStub;
    let MessageRepositoryStub;
    let DroneDataServiceStub;
    let MessageStorerStub;

    beforeEach(() => {
        // Mock DroneResponseGenerator
        DroneResponseGeneratorStub = sinon.stub(DroneResponseGenerator, 'generateResponse');
        
        // Mock MessageRepository
        MessageRepositoryStub = sinon.stub(MessageRepository, 'getMessagesByTimestamp');
        
        // Mock DroneDataService
        DroneDataServiceStub = sinon.stub(DroneDataService, 'validateGame');
        
        // Mock MessageStorer
        MessageStorerStub = sinon.stub(MessageStorer, 'store');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('process', () => {
        it('should limit messages to last 30 when calling DroneResponseGenerator', async () => {
            // Arrange
            const testCode = 'test-codex';
            const testMessage = 'Hola drone';
            
            // Crear 35 mensajes de prueba (más de 30 para probar la limitación)
            const mockMessages = [];
            for (let i = 1; i <= 35; i++) {
                mockMessages.push({
                    id: `msg${i}`,
                    message: `Mensaje ${i}`,
                    user: i % 2 === 0 ? 'drone' : 'player',
                    timestamp: new Date(Date.now() + i * 1000).toISOString()
                });
            }
            
            // Configurar los mocks
            DroneDataServiceStub.resolves();
            MessageRepositoryStub.resolves(mockMessages);
            MessageStorerStub.resolves('test-message-id');
            DroneResponseGeneratorStub.resolves({
                message: 'Respuesta del drone',
                photoUrls: []
            });

            // Act
            await ProcessPlayerMessage.process({ code: testCode, message: testMessage });

            // Assert
            expect(DroneResponseGeneratorStub.calledOnce).to.be.true;
            
            // Verificar que se pasaron solo los últimos 30 mensajes
            const callArgs = DroneResponseGeneratorStub.getCall(0).args;
            const passedMessages = callArgs[0];
            
            expect(passedMessages).to.have.length(30);
            expect(passedMessages[0].message).to.equal('Mensaje 6'); // Los últimos 30 (del 6 al 35)
            expect(passedMessages[29].message).to.equal('Mensaje 35');
            
            console.log('✅ Test passed: Only last 30 messages were sent to DroneResponseGenerator');
        });

        it('should handle less than 30 messages correctly', async () => {
            // Arrange
            const testCode = 'test-codex';
            const testMessage = 'Hola drone';
            
            // Crear solo 15 mensajes de prueba
            const mockMessages = [];
            for (let i = 1; i <= 15; i++) {
                mockMessages.push({
                    id: `msg${i}`,
                    message: `Mensaje ${i}`,
                    user: i % 2 === 0 ? 'drone' : 'player',
                    timestamp: new Date(Date.now() + i * 1000).toISOString()
                });
            }
            
            // Configurar los mocks
            DroneDataServiceStub.resolves();
            MessageRepositoryStub.resolves(mockMessages);
            MessageStorerStub.resolves('test-message-id');
            DroneResponseGeneratorStub.resolves({
                message: 'Respuesta del drone',
                photoUrls: []
            });

            // Act
            await ProcessPlayerMessage.process({ code: testCode, message: testMessage });

            // Assert
            expect(DroneResponseGeneratorStub.calledOnce).to.be.true;
            
            // Verificar que se pasaron todos los mensajes (menos de 30)
            const callArgs = DroneResponseGeneratorStub.getCall(0).args;
            const passedMessages = callArgs[0];
            
            expect(passedMessages).to.have.length(15);
            expect(passedMessages[0].message).to.equal('Mensaje 1');
            expect(passedMessages[14].message).to.equal('Mensaje 15');
            
            console.log('✅ Test passed: All messages (less than 30) were sent to DroneResponseGenerator');
        });

        it('should handle exactly 30 messages correctly', async () => {
            // Arrange
            const testCode = 'test-codex';
            const testMessage = 'Hola drone';
            
            // Crear exactamente 30 mensajes de prueba
            const mockMessages = [];
            for (let i = 1; i <= 30; i++) {
                mockMessages.push({
                    id: `msg${i}`,
                    message: `Mensaje ${i}`,
                    user: i % 2 === 0 ? 'drone' : 'player',
                    timestamp: new Date(Date.now() + i * 1000).toISOString()
                });
            }
            
            // Configurar los mocks
            DroneDataServiceStub.resolves();
            MessageRepositoryStub.resolves(mockMessages);
            MessageStorerStub.resolves('test-message-id');
            DroneResponseGeneratorStub.resolves({
                message: 'Respuesta del drone',
                photoUrls: []
            });

            // Act
            await ProcessPlayerMessage.process({ code: testCode, message: testMessage });

            // Assert
            expect(DroneResponseGeneratorStub.calledOnce).to.be.true;
            
            // Verificar que se pasaron exactamente 30 mensajes
            const callArgs = DroneResponseGeneratorStub.getCall(0).args;
            const passedMessages = callArgs[0];
            
            expect(passedMessages).to.have.length(30);
            expect(passedMessages[0].message).to.equal('Mensaje 1');
            expect(passedMessages[29].message).to.equal('Mensaje 30');
            
            console.log('✅ Test passed: Exactly 30 messages were sent to DroneResponseGenerator');
        });
    });
});
