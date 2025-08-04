const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Obtener la instancia de Firestore usando la configuración centralizada
const db = DatabaseConfig.getDb();

async function resetTestData() {
    try {
        console.log('🧹 Iniciando reset de datos de prueba...');

        // Limpiar la colección twin-islands
        const collectionName = DatabaseConfig.getCollectionName();
        console.log(`\n📁 Limpiando colección: ${collectionName}`);
        
        // Obtener todos los documentos de la colección
        const snapshot = await db.collection(collectionName).get();
        
        if (snapshot.empty) {
            console.log(`   ⚠️  La colección ${collectionName} está vacía`);
            return;
        }

        console.log(`   📄 Encontrados ${snapshot.size} documentos`);

        // Mantener documentos pero limpiar sus mensajes
        const processPromises = snapshot.docs.map(async (doc) => {
            const docRef = doc.ref;
            const docId = doc.id;
            
            console.log(`   📄 Procesando documento: ${docId}`);

            // Obtener todas las subcolecciones del documento
            const subcollections = await docRef.listCollections();
            
            // Eliminar solo las subcolecciones de mensajes
            for (const subcollection of subcollections) {
                if (subcollection.id === 'messages') {
                    console.log(`      📂 Limpiando subcolección: ${subcollection.id}`);
                    
                    // Obtener todos los documentos de la subcolección
                    const subSnapshot = await subcollection.get();
                    
                    if (!subSnapshot.empty) {
                        // Eliminar todos los documentos de la subcolección
                        const subDeletePromises = subSnapshot.docs.map(subDoc => subDoc.ref.delete());
                        await Promise.all(subDeletePromises);
                        console.log(`         ✅ ${subSnapshot.size} mensajes eliminados de ${subcollection.id}`);
                    } else {
                        console.log(`         ℹ️  No hay mensajes para eliminar en ${subcollection.id}`);
                    }
                } else {
                    console.log(`      ℹ️  Manteniendo subcolección: ${subcollection.id}`);
                }
            }

            console.log(`      ✅ Documento ${docId} mantenido (solo mensajes eliminados)`);
        });

        await Promise.all(processPromises);
        console.log(`   ✅ Colección ${collectionName} procesada (documentos mantenidos, mensajes eliminados)`);

        console.log('\n🎉 Reset de datos completado exitosamente!');
        console.log('\n📊 Datos procesados:');
        console.log('✅ Documentos mantenidos');
        console.log('✅ Solo mensajes eliminados de las subcolecciones');
        console.log('✅ Otras subcolecciones preservadas');

    } catch (error) {
        console.error('❌ Error al resetear datos de prueba:', error);
        throw error;
    }
}

// Ejecutar la función
resetTestData()
    .then(() => {
        console.log('\n✅ Script de reset completado exitosamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script de reset falló:', error);
        process.exit(1);
    }); 