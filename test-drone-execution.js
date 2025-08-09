const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');
const DroneResponseGenerator = require('./multiscapes/domain/DroneResponseGenerator');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Obtener la instancia de Firestore usando la configuración centralizada
const db = DatabaseConfig.getDb();

async function clearDatabase() {
    try {
        console.log('🧹 Limpiando base de datos...');
        
        const collectionName = DatabaseConfig.getCollectionName();
        console.log(`📁 Limpiando colección: ${collectionName}`);
        
        // Obtener todos los documentos de la colección
        const snapshot = await db.collection(collectionName).get();
        
        if (snapshot.empty) {
            console.log(`   ⚠️  La colección ${collectionName} está vacía`);
            return;
        }

        console.log(`   📄 Encontrados ${snapshot.size} documentos`);

        // Eliminar documentos y sus subcolecciones
        const deletePromises = snapshot.docs.map(async (doc) => {
            const docRef = doc.ref;
            const docId = doc.id;
            
            console.log(`   📄 Eliminando documento: ${docId}`);

            // Obtener todas las subcolecciones del documento
            const subcollections = await docRef.listCollections();
            
            // Eliminar todas las subcolecciones
            for (const subcollection of subcollections) {
                console.log(`      📂 Eliminando subcolección: ${subcollection.id}`);
                
                const subSnapshot = await subcollection.get();
                if (!subSnapshot.empty) {
                    const subDeletePromises = subSnapshot.docs.map(subDoc => subDoc.ref.delete());
                    await Promise.all(subDeletePromises);
                    console.log(`         ✅ ${subSnapshot.size} documentos eliminados de ${subcollection.id}`);
                }
            }

            // Eliminar el documento principal
            await docRef.delete();
            console.log(`      ✅ Documento ${docId} eliminado completamente`);
        });

        await Promise.all(deletePromises);
        console.log(`   ✅ Colección ${collectionName} limpiada completamente`);

    } catch (error) {
        console.error('❌ Error al limpiar la base de datos:', error);
        throw error;
    }
}

async function loadSampleData() {
    try {
        console.log('\n🚀 Cargando datos de muestra...');

        const collectionName = DatabaseConfig.getCollectionName();
        const docPath = DatabaseConfig.getDocumentPath('codex');
        
        // Crear documento 'codex'
        const codexRef = db.doc(docPath);
        await codexRef.set({
            start: "1",
            barreraElectromagneticaAbierta: false,
            created: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Documento "codex" creado');

        // Crear algunos mensajes de prueba en la subcolección messages
        const messagesRef = codexRef.collection('messages');
        
        const testMessages = [
            {
                message: "Hola Johnson, ¿puedes explorar la zona?",
                user: "player",
                timestamp: new Date(Date.now() - 300000).toISOString()
            },
            {
                message: "¡Hola! Soy Johnson, tu dron de investigación. ¡Me alegra verte por aquí! ¿Qué tal va todo?",
                user: "drone",
                timestamp: new Date(Date.now() - 280000).toISOString()
            },
            {
                message: "¿Qué hay por aquí?",
                user: "player", 
                timestamp: new Date(Date.now() - 200000).toISOString()
            },
            {
                message: "Veo una playa tranquila con arena dorada, acantilados al sur y una barrera electromagnética al norte. También hay un teclado alfanumérico semienterrado en la arena.",
                user: "drone",
                timestamp: new Date(Date.now() - 180000).toISOString()
            }
        ];

        for (const msg of testMessages) {
            await messagesRef.add(msg);
        }
        console.log('✅ 4 mensajes de prueba creados');

    } catch (error) {
        console.error('❌ Error al cargar datos de muestra:', error);
        throw error;
    }
}

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

async function getAllMessages() {
    try {
        const docPath = DatabaseConfig.getDocumentPath('codex');
        const messagesRef = db.doc(docPath).collection('messages');
        const snapshot = await messagesRef.orderBy('timestamp', 'asc').get();
        
        const messages = [];
        snapshot.forEach(doc => {
            messages.push(doc.data());
        });
        
        return messages;
    } catch (error) {
        console.error('❌ Error al obtener mensajes:', error);
        return [];
    }
}

async function executeDroneResponseWithCode() {
    try {
        console.log('\n🤖 EJECUTANDO DroneResponseGenerator CON CÓDIGO...');
        console.log('=' .repeat(60));
        
        // Obtener mensajes actuales
        const messages = await getAllMessages();
        
        // Agregar un mensaje del jugador con un código
        const newMessage = {
            message: "Johnson, prueba el código DOTBA",
            user: "player",
            timestamp: new Date().toISOString()
        };
        
        // Simular que se agrega el mensaje a la base de datos
        const docPath = DatabaseConfig.getDocumentPath('codex');
        const messagesRef = db.doc(docPath).collection('messages');
        await messagesRef.add(newMessage);
        
        // Obtener todos los mensajes incluyendo el nuevo
        const updatedMessages = await getAllMessages();
        
        console.log('\n📨 MENSAJES DE ENTRADA:');
        updatedMessages.forEach((msg, index) => {
            console.log(`${index + 1}. [${msg.user}]: ${msg.message}`);
        });
        
        console.log('\n🚀 EJECUTANDO DroneResponseGenerator...');
        console.log('⏱️  Esperando respuesta de la IA...');
        
        // Ejecutar DroneResponseGenerator
        const response = await DroneResponseGenerator.generateResponse(updatedMessages);
        
        console.log('\n✅ RESPUESTA RECIBIDA:');
        console.log('📝 Mensaje:', response.message);
        console.log('📷 Fotos:', response.photoUrls);
        
        return response;
        
    } catch (error) {
        console.error('\n❌ ERROR al ejecutar DroneResponseGenerator:', error);
        console.error('Stack trace:', error.stack);
        return null;
    }
}

async function executeDroneResponseWithoutCode() {
    try {
        console.log('\n🤖 EJECUTANDO DroneResponseGenerator SIN CÓDIGO...');
        console.log('=' .repeat(60));
        
        // Obtener mensajes actuales
        const messages = await getAllMessages();
        
        // Agregar un mensaje del jugador sin código
        const newMessage = {
            message: "Johnson, ¿puedes ir al norte?",
            user: "player",
            timestamp: new Date().toISOString()
        };
        
        // Simular que se agrega el mensaje a la base de datos
        const docPath = DatabaseConfig.getDocumentPath('codex');
        const messagesRef = db.doc(docPath).collection('messages');
        await messagesRef.add(newMessage);
        
        // Obtener todos los mensajes incluyendo el nuevo
        const updatedMessages = await getAllMessages();
        
        console.log('\n📨 MENSAJES DE ENTRADA:');
        updatedMessages.forEach((msg, index) => {
            console.log(`${index + 1}. [${msg.user}]: ${msg.message}`);
        });
        
        console.log('\n🚀 EJECUTANDO DroneResponseGenerator...');
        console.log('⏱️  Esperando respuesta de la IA...');
        
        // Ejecutar DroneResponseGenerator
        const response = await DroneResponseGenerator.generateResponse(updatedMessages);
        
        console.log('\n✅ RESPUESTA RECIBIDA:');
        console.log('📝 Mensaje:', response.message);
        console.log('📷 Fotos:', response.photoUrls);
        
        return response;
        
    } catch (error) {
        console.error('\n❌ ERROR al ejecutar DroneResponseGenerator:', error);
        console.error('Stack trace:', error.stack);
        return null;
    }
}

async function main() {
    try {
        console.log('🔄 INICIANDO TEST COMPLETO DE DroneResponseGenerator');
        console.log('=' .repeat(80));
        
        // Paso 1: Limpiar base de datos
        await clearDatabase();
        
        // Paso 2: Cargar datos de muestra
        await loadSampleData();
        
        // Paso 3: Mostrar estado inicial
        console.log('\n📊 ESTADO INICIAL:');
        await getFirebaseDocumentState();
        
        // Paso 4: Ejecutar sin código (debe decir que no puede ir al norte)
        console.log('\n' + '=' .repeat(80));
        console.log('TEST 1: SIN CÓDIGO - El dron debe decir que no puede ir al norte');
        console.log('=' .repeat(80));
        await executeDroneResponseWithoutCode();
        
        // Mostrar estado después del primer test
        console.log('\n📊 ESTADO DESPUÉS DEL TEST 1:');
        await getFirebaseDocumentState();
        
        // Paso 5: Ejecutar con código (debe procesar el código y abrir la barrera)
        console.log('\n' + '=' .repeat(80));
        console.log('TEST 2: CON CÓDIGO - El dron debe procesar DOTBA y abrir la barrera');
        console.log('=' .repeat(80));
        await executeDroneResponseWithCode();
        
        // Mostrar estado final
        console.log('\n📊 ESTADO FINAL:');
        await getFirebaseDocumentState();
        
        console.log('\n🎉 TEST COMPLETO FINALIZADO');
        console.log('🔍 Revisa las trazas arriba para ver si checkCodes se ejecutó correctamente');
        console.log('📊 Revisa el estado del documento Firebase para ver si cambió la barrera');
        
    } catch (error) {
        console.error('\n💥 ERROR CRÍTICO:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Ejecutar el script
if (require.main === module) {
    main()
        .then(() => {
            console.log('\n✅ Script completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script falló:', error);
            process.exit(1);
        });
}

module.exports = {
    clearDatabase,
    loadSampleData,
    getFirebaseDocumentState,
    executeDroneResponseWithCode,
    executeDroneResponseWithoutCode
};