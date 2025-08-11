const { expect } = require('chai');
const MoveTo = require('../../multiscapes/domain/moveTo');
const DatabaseConfig = require('../../multiscapes/infrastructure/DatabaseConfig');

describe('CurrentRoomTitle Update', () => {
    it('should update both currentRoom and currentRoomTitle when moving to a new location', async () => {
        // Arrange
        const code = 'test-currentRoomTitle-update';
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
        
        // Verificar que currentRoomTitle también se actualizó
        expect(data.currentRoomTitle).to.equal('Playa Sur > Playa Norte');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should update currentRoomTitle with the correct title from the room data file', async () => {
        // Arrange
        const code = 'test-currentRoomTitle-correct-title';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        // Act
        await MoveTo.moveTo('playa-norte', code);

        // Assert
        const doc = await db.collection('twin-islands').doc(code).get();
        const data = doc.data();
        
        // Verificar que currentRoomTitle contiene el título exacto del archivo de datos
        expect(data.currentRoomTitle).to.equal('Playa Sur > Playa Norte');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });

    it('should maintain currentRoomTitle consistency when moving between rooms', async () => {
        // Arrange
        const code = 'test-currentRoomTitle-consistency';
        const db = DatabaseConfig.getDb();
        
        // Crear el documento con barrera abierta y piramide abierta
        await db.collection('twin-islands').doc(code).set({
            barreraElectromagneticaAbierta: true,
            piramideAbierta: true,
            currentRoom: 'playa-sur'
        });
        
        // Act - Mover a playa-norte
        await MoveTo.moveTo('playa-norte', code);
        
        // Verificar primera actualización
        let doc = await db.collection('twin-islands').doc(code).get();
        let data = doc.data();
        expect(data.currentRoomTitle).to.equal('Playa Sur > Playa Norte');
        
        // Act - Mover a interior-piramide
        await MoveTo.moveTo('interior-piramide', code);
        
        // Verificar segunda actualización
        doc = await db.collection('twin-islands').doc(code).get();
        data = doc.data();
        expect(data.currentRoomTitle).to.equal('Playa Sur > Playa Norte > Interior de la Pirámide');
        
        // Cleanup
        await db.collection('twin-islands').doc(code).delete();
    });
});
