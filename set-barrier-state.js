const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Obtener la instancia de Firestore usando la configuración centralizada
const db = DatabaseConfig.getDb();

async function setBarrierState(isOpen = false) {
    try {
        console.log(`🔧 Configurando estado de barrera electromagnética...`);
        console.log(`📊 Estado: ${isOpen ? 'ABIERTA' : 'CERRADA'}`);
        
        // Referencia al documento principal
        const docRef = db.collection('twin-islands').doc('codex');
        
        // Actualizar el documento con el estado de la barrera
        await docRef.update({
            barreraElectromagneticaAbierta: isOpen
        });
        
        console.log(`✅ Estado de barrera actualizado exitosamente`);
        console.log(`📋 Valor establecido: ${isOpen}`);
        
    } catch (error) {
        console.error('❌ Error al actualizar el estado de la barrera:', error);
        throw error;
    }
}

async function getBarrierState() {
    try {
        console.log(`🔍 Consultando estado actual de la barrera...`);
        
        const docRef = db.collection('twin-islands').doc('codex');
        const doc = await docRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            const isOpen = data.barreraElectromagneticaAbierta || false;
            console.log(`📊 Estado actual: ${isOpen ? 'ABIERTA' : 'CERRADA'}`);
            return isOpen;
        } else {
            console.log(`⚠️  Documento no encontrado, estableciendo estado por defecto`);
            await setBarrierState(false);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al consultar el estado de la barrera:', error);
        throw error;
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    try {
        switch (command) {
            case 'open':
                await setBarrierState(true);
                break;
            case 'close':
                await setBarrierState(false);
                break;
            case 'status':
                await getBarrierState();
                break;
            default:
                console.log('📋 Uso: node set-barrier-state.js [open|close|status]');
                console.log('   open   - Abrir la barrera electromagnética');
                console.log('   close  - Cerrar la barrera electromagnética');
                console.log('   status - Consultar estado actual');
                break;
        }
    } catch (error) {
        console.error('❌ Error en la ejecución:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    main();
}

module.exports = { setBarrierState, getBarrierState }; 