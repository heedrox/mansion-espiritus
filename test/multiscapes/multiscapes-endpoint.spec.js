const { expect } = require('chai');
const sinon = require('sinon');

describe('Multiscapes Endpoint', () => {
    let mockRequest;
    let mockResponse;
    let ProcessPlayerMessageStub;
    let GameStateServiceStub;
    let requireStub;

    beforeEach(() => {
        // Mock request object
        mockRequest = {
            method: 'POST',
            body: { code: 'johnson', message: 'test message' }
        };

        // Mock response object
        mockResponse = {
            set: sinon.stub(),
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub()
        };

        // Mock ProcessPlayerMessage
        const ProcessPlayerMessage = require('../../multiscapes/application/ProcessPlayerMessage');
        ProcessPlayerMessageStub = sinon.stub(ProcessPlayerMessage, 'process');

        // Mock GameStateService
        const GameStateService = require('../../multiscapes/infrastructure/GameStateService');
        GameStateServiceStub = {
            getGameState: sinon.stub()
        };
        sinon.stub(GameStateService.prototype, 'getGameState').callsFake(GameStateServiceStub.getGameState);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('multiscapes endpoint', () => {
        it('should include currentRoom in response for playa-sur', async () => {
            // Arrange
            const mockDroneResponse = {
                message: 'Respuesta del drone desde playa sur',
                photoUrls: []
            };

            const mockGameState = {
                currentRoom: 'playa-sur',
                barreraElectromagneticaAbierta: false
            };

            ProcessPlayerMessageStub.resolves(mockDroneResponse);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('message', 'Respuesta del drone desde playa sur');
            expect(responseData).to.have.property('photoUrls').that.is.an('array');
            expect(responseData).to.have.property('timestamp').that.is.a('string');
            expect(responseData).to.have.property('currentRoom', 'Playa Sur');
        });

        it('should include currentRoom in response for playa-norte', async () => {
            // Arrange
            const mockDroneResponse = {
                message: 'Respuesta del drone desde playa norte',
                photoUrls: ['https://example.com/photo.jpg']
            };

            const mockGameState = {
                currentRoom: 'playa-norte',
                piramideAbierta: true
            };

            ProcessPlayerMessageStub.resolves(mockDroneResponse);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('message', 'Respuesta del drone desde playa norte');
            expect(responseData).to.have.property('photoUrls').that.deep.equals(['https://example.com/photo.jpg']);
            expect(responseData).to.have.property('timestamp').that.is.a('string');
            expect(responseData).to.have.property('currentRoom', 'Playa Sur > Playa Norte');
        });

        it('should include currentRoom in response for interior-piramide', async () => {
            // Arrange
            const mockDroneResponse = {
                message: 'Respuesta del drone desde interior de la pirámide',
                photoUrls: []
            };

            const mockGameState = {
                currentRoom: 'interior-piramide'
            };

            ProcessPlayerMessageStub.resolves(mockDroneResponse);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('currentRoom', 'Playa Sur > Playa Norte > Interior de la Pirámide');
        });

        it('should handle missing room file gracefully', async () => {
            // Arrange
            const mockDroneResponse = {
                message: 'Respuesta del drone',
                photoUrls: []
            };

            const mockGameState = {
                currentRoom: 'habitacion-inexistente'
            };

            ProcessPlayerMessageStub.resolves(mockDroneResponse);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('currentRoom', 'habitacion-inexistente'); // Fallback al nombre interno
        });

        it('should use default room when gameState has no currentRoom', async () => {
            // Arrange
            const mockDroneResponse = {
                message: 'Respuesta del drone',
                photoUrls: []
            };

            const mockGameState = {}; // Sin currentRoom

            ProcessPlayerMessageStub.resolves(mockDroneResponse);
            GameStateServiceStub.getGameState.resolves(mockGameState);

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('currentRoom', 'Playa Sur'); // Default es playa-sur
        });

        it('should handle validation errors without currentRoom', async () => {
            // Arrange
            mockRequest.body = { message: 'test' }; // Sin code

            // Act
            const multiscapes = require('../../multiscapes');
            await multiscapes.multiscapes(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status.calledWith(400)).to.be.true;
            expect(mockResponse.json.calledOnce).to.be.true;
            const responseData = mockResponse.json.getCall(0).args[0];
            
            expect(responseData).to.have.property('error', 'El parámetro "code" es requerido');
            expect(responseData).to.not.have.property('currentRoom'); // No debe incluir currentRoom en errores
        });
    });
});
