const DatabaseConfig = require('./multiscapes/infrastructure/DatabaseConfig');

// Configurar para usar emulador local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Obtener la instancia de Firestore usando la configuración centralizada
const db = DatabaseConfig.getDb();

async function createTestData(code = 'codex') {
    try {
        console.log('🚀 Iniciando creación de datos de prueba...');
        console.log(`🔑 Código: ${code}`);

        // Crear el documento en la colección twin-islands
        const collectionName = DatabaseConfig.getCollectionName();
        const docPath = DatabaseConfig.getDocumentPath(code);
        
        // Crear documento
        const docRef = db.doc(docPath);
        await docRef.set({
            start: "1",
            created: new Date().toISOString()
        });
        console.log(`✅ Documento "${code}" creado`);

        // Crear algunos mensajes de prueba en la subcolección messages
        const messagesRef = docRef.collection('messages');
        
        const testMessages = [
            {
                message: "Hola, este es el primer mensaje de prueba",
                user: "player",
                timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutos atrás
            },
            {
                message: "¡Hola! Soy Johnson, tu dron de investigación. ¡Me alegra verte por aquí! ¿Qué tal va todo?",
                user: "drone",
                timestamp: new Date(Date.now() - 280000).toISOString() // 4.7 minutos atrás
            },
            {
                message: "Segundo mensaje de prueba",
                user: "player", 
                timestamp: new Date(Date.now() - 200000).toISOString() // 3 minutos atrás
            },
            {
                message: "¡Oh, otro mensaje! Estoy aquí para ayudarte a resolver el misterio de las Islas Gemelas. ¡Es emocionante!",
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
            await messagesRef.add(msg);
        }
        console.log('✅ 5 mensajes de prueba creados (3 player + 2 drone)');

        console.log('🎉 Datos de prueba creados exitosamente!');
        console.log('\n📊 Estructura creada:');
        console.log('twin-islands/');
        console.log(`└── ${code}/`);
        console.log('    ├── start: "1"');
        console.log('    └── messages/ (5 mensajes: 3 player + 2 drone)');

    } catch (error) {
        console.error('❌ Error al crear datos de prueba:', error);
        throw error;
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const code = args[0] || 'codex';
    
    try {
        await createTestData(code);
        console.log('\n✅ Script completado exitosamente');
    } catch (error) {
        console.error('\n❌ Script falló:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    main();
}

module.exports = { createTestData }; 