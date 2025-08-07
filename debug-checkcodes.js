const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');
const CheckCodes = require('./multiscapes/domain/checkCodes');
const GameStateService = require('./multiscapes/infrastructure/GameStateService');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Obtener la instancia de Firestore usando la configuración centralizada
const db = DatabaseConfig.getDb();

async function getFirebaseDocumentState() {
    try {
        console.log('\n📊 Estado actual del documento Firebase:');
        
        const docPath = DatabaseConfig.getDocumentPath('codex');
        const docRef = db.doc(docPath);
        const docSnapshot = await docRef.get();
        
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            console.log('📄 Documento codex:', JSON.stringify(data, null, 2));
            console.log(`🔒 Estado de la barrera: ${data.barreraElectromagneticaAbierta ? 'ABIERTA' : 'CERRADA'}`);
            return data;
        } else {
            console.log('❌ El documento codex no existe');
            return null;
        }
    } catch (error) {
        console.error('❌ Error al obtener estado del documento:', error);
        return null;
    }
}

async function testCheckCodesDirectly() {
    console.log('\n🧪 TESTING CheckCodes DIRECTAMENTE...');
    console.log('=' .repeat(60));
    
    // Test 1: Código válido DOTBA
    console.log('\n📝 Test 1: Código válido "DOTBA"');
    const result1 = CheckCodes.checkCode('DOTBA');
    console.log('✅ Resultado:', JSON.stringify(result1, null, 2));
    
    // Test 2: Código inválido
    console.log('\n📝 Test 2: Código inválido "ABCD"');
    const result2 = CheckCodes.checkCode('ABCD');
    console.log('✅ Resultado:', JSON.stringify(result2, null, 2));
    
    // Test 3: Código válido en minúsculas
    console.log('\n📝 Test 3: Código válido en minúsculas "dotba"');
    const result3 = CheckCodes.checkCode('dotba');
    console.log('✅ Resultado:', JSON.stringify(result3, null, 2));
    
    return { result1, result2, result3 };
}

async function testGameStateService() {
    console.log('\n🎮 TESTING GameStateService...');
    console.log('=' .repeat(60));
    
    const gameStateService = new GameStateService();
    
    // Test obtener estado actual
    console.log('\n📝 Test: Obtener estado actual');
    const currentState = await gameStateService.getGameState();
    console.log('✅ Estado actual:', JSON.stringify(currentState, null, 2));
    
    // Test abrir barrera
    console.log('\n📝 Test: Abrir barrera electromagnética');
    await gameStateService.openBarrier();
    console.log('✅ Barrera abierta');
    
    // Verificar estado después de abrir barrera
    console.log('\n📝 Test: Verificar estado después de abrir barrera');
    const newState = await gameStateService.getGameState();
    console.log('✅ Nuevo estado:', JSON.stringify(newState, null, 2));
    
    return { currentState, newState };
}

async function simulateCheckCodesExecution() {
    console.log('\n⚙️  SIMULANDO EJECUCIÓN DE checkCodes TOOL...');
    console.log('=' .repeat(60));
    
    // Simular el proceso que ocurre en DroneResponseGenerator
    const code = 'DOTBA';
    const reason = 'El usuario mencionó el código DOTBA';
    
    console.log(`🔍 Ejecutando checkCodes con código: ${code}`);
    console.log(`📝 Razón: ${reason}`);
    
    // Ejecutar checkCode
    const result = CheckCodes.checkCode(code);
    console.log(`📋 Resultado: ${result.isValid ? 'Válido' : 'Inválido'} - ${result.message}`);
    console.log(`📊 StateChanges:`, result.stateChanges);
    
    // Aplicar cambios de estado si el código es válido
    if (result.isValid && result.stateChanges) {
        console.log(`🔄 Aplicando cambios de estado...`);
        const gameStateService = new GameStateService();
        
        for (const [key, value] of Object.entries(result.stateChanges)) {
            console.log(`🔧 Aplicando ${key} = ${value}`);
            if (key === 'barreraElectromagneticaAbierta' && value === true) {
                await gameStateService.openBarrier();
                console.log('🔓 Barrera electromagnética abierta desde simulación de checkCodes');
            }
        }
    }
    
    return result;
}

async function resetBarrierState() {
    console.log('\n🔄 RESETEANDO estado de la barrera...');
    
    try {
        const docPath = DatabaseConfig.getDocumentPath('codex');
        const codexRef = db.doc(docPath);
        await codexRef.update({
            barreraElectromagneticaAbierta: false,
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Barrera cerrada (estado reseteado)');
    } catch (error) {
        console.error('❌ Error al resetear estado:', error);
    }
}

async function main() {
    try {
        console.log('🔍 INICIANDO DEBUG DE CHECKCODES');
        console.log('=' .repeat(80));
        
        // Estado inicial
        console.log('\n📊 ESTADO INICIAL:');
        await getFirebaseDocumentState();
        
        // Test CheckCodes directamente
        await testCheckCodesDirectly();
        
        // Test GameStateService
        await resetBarrierState(); // Reset para test limpio
        await testGameStateService();
        
        // Reset para la simulación
        await resetBarrierState();
        console.log('\n📊 ESTADO ANTES DE SIMULACIÓN:');
        await getFirebaseDocumentState();
        
        // Simular la ejecución completa
        await simulateCheckCodesExecution();
        
        // Estado final
        console.log('\n📊 ESTADO FINAL:');
        await getFirebaseDocumentState();
        
        console.log('\n🎉 DEBUG COMPLETO FINALIZADO');
        console.log('🔍 Revisa las trazas arriba para verificar:');
        console.log('   - checkCodes procesa códigos correctamente');
        console.log('   - GameStateService actualiza el estado');
        console.log('   - El documento Firebase refleja los cambios');
        
    } catch (error) {
        console.error('\n💥 ERROR CRÍTICO:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Ejecutar el script
if (require.main === module) {
    main()
        .then(() => {
            console.log('\n✅ Debug completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Debug falló:', error);
            process.exit(1);
        });
}

module.exports = {
    testCheckCodesDirectly,
    testGameStateService,
    simulateCheckCodesExecution,
    getFirebaseDocumentState,
    resetBarrierState
};