const { expect } = require('chai');
const DroneResponseGenerator = require('../../multiscapes/domain/DroneResponseGenerator');
const DatabaseConfig = require('../../multiscapes/infrastructure/DatabaseConfig');

describe('Movement Command', () => {
    it('should allow movement to playa-norte when barrera is open', async () => {
        // Arrange
        const code = 'test-movement-open';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        const messages = [
            { user: 'player', message: 'Ve a playa-norte' }
        ];

        // Act
        const response = await DroneResponseGenerator.generateResponse(messages, code);

        // Assert
        expect(response.message).to.be.a('string');
        expect(response.message.toLowerCase()).to.include('movimiento');
        expect(response.message.toLowerCase()).to.include('playa-norte');
        
        // Verificar que currentRoom se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-norte');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should deny movement to playa-norte when barrera is closed', async () => {
        // Arrange
        const code = 'test-movement-closed';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera cerrada
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: false,
            currentRoom: 'playa-sur'
        });
        
        const messages = [
            { user: 'player', message: 'Ve a playa-norte' }
        ];

        // Act
        const response = await DroneResponseGenerator.generateResponse(messages, code);

        // Assert
        expect(response.message).to.be.a('string');
        expect(response.message.toLowerCase()).to.include('no puedo');
        expect(response.message.toLowerCase()).to.include('barrera');
        
        // Verificar que currentRoom NO se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-sur');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should deny movement to invalid destination', async () => {
        // Arrange
        const code = 'test-movement-invalid';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        const messages = [
            { user: 'player', message: 'Ve a lugar-inexistente' }
        ];

        // Act
        const response = await DroneResponseGenerator.generateResponse(messages, code);

        // Assert
        expect(response.message).to.be.a('string');
        expect(response.message.toLowerCase()).to.include('no puedo');
        expect(response.message.toLowerCase()).to.include('lugar-inexistente');
        
        // Verificar que currentRoom NO se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-sur');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });
});
