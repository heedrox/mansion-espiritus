const { expect } = require('chai');
const sinon = require('sinon');
const ProcessPlayerMessage = require('../../../multiscapes/application/ProcessPlayerMessage');

describe('ProcessPlayerMessage', () => {
    let MessageStub, MessageStorerStub, DroneDataServiceStub, MessageRepositoryStub, DroneResponseGeneratorStub;

    beforeEach(() => {
        // Mock all dependencies
        MessageStub = {
            createAsPlayer: sinon.stub(),
            create: sinon.stub()
        };
        
        MessageStorerStub = {
            store: sinon.stub()
        };
        
        DroneDataServiceStub = {
            validateDrone: sinon.stub()
        };
        
        MessageRepositoryStub = {
            getMessagesByTimestamp: sinon.stub()
        };
        
        DroneResponseGeneratorStub = {
            generateResponse: sinon.stub().resolves()
        };

        // Stub all modules
        sinon.stub(require('../../../multiscapes/domain/Message'), 'createAsPlayer').callsFake(MessageStub.createAsPlayer);
        sinon.stub(require('../../../multiscapes/domain/Message'), 'create').callsFake(MessageStub.create);
        sinon.stub(require('../../../multiscapes/infrastructure/MessageStorer'), 'store').callsFake(MessageStorerStub.store);
        sinon.stub(require('../../../multiscapes/infrastructure/DroneDataService'), 'validateDrone').callsFake(DroneDataServiceStub.validateDrone);
        sinon.stub(require('../../../multiscapes/infrastructure/MessageRepository'), 'getMessagesByTimestamp').callsFake(MessageRepositoryStub.getMessagesByTimestamp);
        sinon.stub(require('../../../multiscapes/domain/DroneResponseGenerator'), 'generateResponse').callsFake(DroneResponseGeneratorStub.generateResponse);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('process', () => {
        it('should process player message and generate drone response', async () => {
            // Arrange
            const mockMessageInstance = { toJSON: () => ({ message: 'test', user: 'player', timestamp: '2025-07-20T15:00:00.000Z' }) };
            const mockDroneMessageInstance = { toJSON: () => ({ message: 'response', user: 'drone', timestamp: '2025-07-20T15:00:01.000Z' }) };
            const mockMessages = [
                { id: 'msg1', message: 'test', user: 'player', timestamp: '2025-07-20T15:00:00.000Z' }
            ];

            MessageStub.createAsPlayer.returns(mockMessageInstance);
            MessageStub.create.returns(mockDroneMessageInstance);
            MessageStorerStub.store.resolves('msg-id-1');
            DroneDataServiceStub.validateDrone.resolves();
            MessageRepositoryStub.getMessagesByTimestamp.resolves(mockMessages);
            DroneResponseGeneratorStub.generateResponse.resolves('me has mandado mensajes: 1');

            const params = {
                code: 'codex',
                drone: 'common',
                message: 'test message'
            };

            // Act
            const result = await ProcessPlayerMessage.process(params);

            // Assert
            expect(result).to.equal('me has mandado mensajes: 1');
            
            // Verify Message.createAsPlayer was called
            expect(MessageStub.createAsPlayer.calledOnce).to.be.true;
            expect(MessageStub.createAsPlayer.calledWith({ 
                message: 'test message', 
                timestamp: sinon.match.string 
            })).to.be.true;

            // Verify MessageStorer.store was called for player message
            expect(MessageStorerStub.store.calledTwice).to.be.true;
            expect(MessageStorerStub.store.firstCall.calledWith(mockMessageInstance, 'codex', 'common')).to.be.true;

            // Verify DroneDataService.validateDrone was called
            expect(DroneDataServiceStub.validateDrone.calledOnce).to.be.true;
            expect(DroneDataServiceStub.validateDrone.calledWith('codex', 'common')).to.be.true;

            // Verify MessageRepository.getMessagesByTimestamp was called
            expect(MessageRepositoryStub.getMessagesByTimestamp.calledOnce).to.be.true;
            expect(MessageRepositoryStub.getMessagesByTimestamp.calledWith('codex', 'common')).to.be.true;

            // Verify DroneResponseGenerator.generateResponse was called
            expect(DroneResponseGeneratorStub.generateResponse.calledOnce).to.be.true;
            expect(DroneResponseGeneratorStub.generateResponse.calledWith(mockMessages, 'common')).to.be.true;
            expect(DroneResponseGeneratorStub.generateResponse.calledWith(mockMessages, 'common')).to.be.true;

            // Verify drone message was created and stored
            expect(MessageStub.create.calledOnce).to.be.true;
            expect(MessageStub.create.calledWith({
                message: 'me has mandado mensajes: 1',
                user: 'drone',
                timestamp: sinon.match.string
            })).to.be.true;

            expect(MessageStorerStub.store.secondCall.calledWith(mockDroneMessageInstance, 'codex', 'common')).to.be.true;
        });

        it('should process without player message when message is not provided', async () => {
            // Arrange
            const mockMessages = [
                { id: 'msg1', message: 'previous message', user: 'player', timestamp: '2025-07-20T14:59:00.000Z' }
            ];

            DroneDataServiceStub.validateDrone.resolves();
            MessageRepositoryStub.getMessagesByTimestamp.resolves(mockMessages);
            DroneResponseGeneratorStub.generateResponse.resolves('me has mandado mensajes: 1');

            const params = {
                code: 'codex',
                drone: 'common'
                // no message provided
            };

            // Act
            const result = await ProcessPlayerMessage.process(params);

            // Assert
            expect(result).to.equal('me has mandado mensajes: 1');
            
            // Verify Message.createAsPlayer was NOT called
            expect(MessageStub.createAsPlayer.called).to.be.false;

            // Verify MessageStorer.store was called only once (for drone response)
            expect(MessageStorerStub.store.calledOnce).to.be.true;

            // Verify other services were called
            expect(DroneDataServiceStub.validateDrone.calledOnce).to.be.true;
            expect(MessageRepositoryStub.getMessagesByTimestamp.calledOnce).to.be.true;
            expect(DroneResponseGeneratorStub.generateResponse.calledOnce).to.be.true;
        });

        it('should handle empty messages array', async () => {
            // Arrange
            const mockMessages = [];

            DroneDataServiceStub.validateDrone.resolves();
            MessageRepositoryStub.getMessagesByTimestamp.resolves(mockMessages);
            DroneResponseGeneratorStub.generateResponse.resolves('me has mandado mensajes: 0');

            const params = {
                code: 'codex',
                drone: 'johnson'
            };

            // Act
            const result = await ProcessPlayerMessage.process(params);

            // Assert
            expect(result).to.equal('me has mandado mensajes: 0');
            expect(MessageRepositoryStub.getMessagesByTimestamp.calledWith('codex', 'johnson')).to.be.true;
            expect(DroneResponseGeneratorStub.generateResponse.calledWith([], 'johnson')).to.be.true;
        });
    });
}); 