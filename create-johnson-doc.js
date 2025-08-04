const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');

// Configurar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

async function createJohnsonDocument() {
    try {
        console.log('🔧 Creando documento johnson...');
        
        const db = DatabaseConfig.getDb();
        const johnsonRef = db.collection('twin-islands').doc('johnson');
        
        // Crear el documento johnson con estructura básica
        await johnsonRef.set({
            start: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Documento johnson creado exitosamente');
        console.log('📋 Ruta: twin-islands/johnson');
        
    } catch (error) {
        console.error('❌ Error creando documento johnson:', error.message);
    }
}

createJohnsonDocument(); 