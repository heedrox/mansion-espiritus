const admin = require('firebase-admin');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Inicializar Firebase Admin para emulador local
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'mansion-espiritus-lkgoxs'
    });
}

const db = admin.firestore();

async function resetTestData() {
    try {
        console.log('🧹 Iniciando reset de datos de prueba...');

        // Lista de colecciones a limpiar
        const collectionsToReset = [
            'twin-islands-codex',
            'twin-islands-test',
            'twin-islands-demo'
        ];

        for (const collectionName of collectionsToReset) {
            console.log(`\n📁 Limpiando colección: ${collectionName}`);
            
            // Obtener todos los documentos de la colección
            const snapshot = await db.collection(collectionName).get();
            
            if (snapshot.empty) {
                console.log(`   ⚠️  La colección ${collectionName} está vacía`);
                continue;
            }

            console.log(`   📄 Encontrados ${snapshot.size} documentos`);

            // Mantener documentos de drones pero limpiar sus mensajes
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
        }

        console.log('\n🎉 Reset de datos completado exitosamente!');
        console.log('\n📊 Datos procesados:');
        console.log('✅ Documentos de drones mantenidos (common, jackson, johnson)');
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