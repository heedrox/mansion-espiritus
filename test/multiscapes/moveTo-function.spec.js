const { expect } = require('chai');
const MoveTo = require('../../multiscapes/domain/moveTo');
const DatabaseConfig = require('../../multiscapes/infrastructure/DatabaseConfig');

describe('MoveTo Function', () => {
    it('should allow movement to playa-norte when barrera is open', async () => {
        // Arrange
        const code = 'test-moveto-open';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        // Act
        const result = await MoveTo.moveTo('playa-norte', code);

        // Assert
        expect(result.success).to.be.true;
        expect(result.message).to.include('Movimiento exitoso');
        expect(result.destination).to.equal('playa-norte');
        expect(result.previousRoom).to.equal('playa-sur');
        
        // Verificar que currentRoom se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-norte');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should deny movement to playa-norte when barrera is closed', async () => {
        // Arrange
        const code = 'test-moveto-closed';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera cerrada
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: false,
            currentRoom: 'playa-sur'
        });
        
        // Act
        const result = await MoveTo.moveTo('playa-norte', code);

        // Assert
        expect(result.success).to.be.false;
        expect(result.message).to.include('No puedo ir a playa-norte');
        expect(result.reason).to.equal('invalid_destination');
        
        // Verificar que currentRoom NO se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-sur');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should deny movement to invalid destination', async () => {
        // Arrange
        const code = 'test-moveto-invalid';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        // Act
        const result = await MoveTo.moveTo('lugar-inexistente', code);

        // Assert
        expect(result.success).to.be.false;
        expect(result.message).to.include('No puedo ir a lugar-inexistente');
        expect(result.reason).to.equal('invalid_destination');
        
        // Verificar que currentRoom NO se actualizó en Firestore
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        expect(data.currentRoom).to.equal('playa-sur');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });
});
