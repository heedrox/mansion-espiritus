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

async function createTestData() {
    try {
        console.log('🚀 Iniciando creación de datos de prueba...');

        // Crear la colección twin-islands-codex con documentos de drones
        const collectionName = 'twin-islands-codex';
        
        // Crear documento 'common'
        const commonRef = db.doc(`${collectionName}/common`);
        await commonRef.set({
            start: "3",
            created: new Date().toISOString()
        });
        console.log('✅ Documento "common" creado');

        // Crear documento 'jackson'
        const jacksonRef = db.doc(`${collectionName}/jackson`);
        await jacksonRef.set({
            start: "1",
            created: new Date().toISOString()
        });
        console.log('✅ Documento "jackson" creado');

        // Crear documento 'johnson'
        const johnsonRef = db.doc(`${collectionName}/johnson`);
        await johnsonRef.set({
            start: "2",
            created: new Date().toISOString()
        });
        console.log('✅ Documento "johnson" creado');

        // Crear algunos mensajes de prueba en la subcolección messages de 'common'
        const commonMessagesRef = commonRef.collection('messages');
        
        const testMessages = [
            {
                message: "Hola, este es el primer mensaje de prueba",
                user: "player",
                timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutos atrás
            },
            {
                message: "Respuesta del drone al primer mensaje",
                user: "drone",
                timestamp: new Date(Date.now() - 280000).toISOString() // 4.7 minutos atrás
            },
            {
                message: "Segundo mensaje de prueba",
                user: "player", 
                timestamp: new Date(Date.now() - 200000).toISOString() // 3 minutos atrás
            },
            {
                message: "Respuesta del drone al segundo mensaje",
                user: "drone",
                timestamp: new Date(Date.now() - 180000).toISOString() // 3 minutos atrás
            },
            {
                message: "Tercer mensaje de prueba",
                user: "player",
                timestamp: new Date(Date.now() - 100000).toISOString() // 1 minuto atrás
            }
        ];

        for (const msg of testMessages) {
            await commonMessagesRef.add(msg);
        }
        console.log('✅ 5 mensajes de prueba creados en "common" (3 player + 2 drone)');

        // Crear algunos mensajes de prueba en 'jackson'
        const jacksonMessagesRef = jacksonRef.collection('messages');
        
        const jacksonMessages = [
            {
                message: "Mensaje para Jackson 1",
                user: "player",
                timestamp: new Date(Date.now() - 600000).toISOString() // 10 minutos atrás
            },
            {
                message: "Respuesta del drone Jackson",
                user: "drone",
                timestamp: new Date(Date.now() - 580000).toISOString() // 9.7 minutos atrás
            },
            {
                message: "Mensaje para Jackson 2", 
                user: "player",
                timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutos atrás
            }
        ];

        for (const msg of jacksonMessages) {
            await jacksonMessagesRef.add(msg);
        }
        console.log('✅ 3 mensajes de prueba creados en "jackson" (2 player + 1 drone)');

        console.log('🎉 Datos de prueba creados exitosamente!');
        console.log('\n📊 Estructura creada:');
        console.log('twin-islands-codex/');
        console.log('├── common/');
        console.log('│   ├── start: "3"');
        console.log('│   └── messages/ (5 mensajes: 3 player + 2 drone)');
        console.log('├── jackson/');
        console.log('│   ├── start: "1"');
        console.log('│   └── messages/ (3 mensajes: 2 player + 1 drone)');
        console.log('└── johnson/');
        console.log('    └── start: "2"');

    } catch (error) {
        console.error('❌ Error al crear datos de prueba:', error);
        throw error;
    }
}

// Ejecutar la función
createTestData()
    .then(() => {
        console.log('\n✅ Script completado exitosamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script falló:', error);
        process.exit(1);
    }); 