const DatabaseConfig = require('./DatabaseConfig');
const admin = require('firebase-admin');

class GameResetService {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    async resetGame(code) {
        try {
            console.log(`🔄 Iniciando reset del juego para código: ${code}`);
            
            // 1. Eliminar el documento completo y todas sus subcolecciones
            await this._deleteDocumentAndSubcollections(code);
            
            // 2. Crear nuevo documento con estado inicial
            await this._createInitialDocument(code);
            
            // 3. Agregar mensaje de introducción
            await this._addIntroductionMessage(code);
            
            console.log(`✅ Reset completado para código: ${code}`);
            return {
                success: true,
                message: `Juego reseteado exitosamente para código: ${code}`,
                code: code
            };
            
        } catch (error) {
            console.error(`❌ Error durante el reset del juego ${code}:`, error);
            throw error;
        }
    }

    async _deleteDocumentAndSubcollections(code) {
        try {
            const docRef = this.db.collection('twin-islands').doc(code);
            
            // Obtener todas las subcolecciones
            const collections = await docRef.listCollections();
            
            // Eliminar cada subcolección
            for (const collection of collections) {
                console.log(`🗑️ Eliminando subcolección: ${collection.id}`);
                const snapshot = await collection.get();
                const batch = this.db.batch();
                
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                
                await batch.commit();
            }
            
            // Eliminar el documento principal
            await docRef.delete();
            console.log(`🗑️ Documento principal eliminado para código: ${code}`);
            
        } catch (error) {
            console.error(`Error al eliminar documento y subcolecciones para ${code}:`, error);
            // Si el documento no existe, no es un error
            if (error.code !== 'NOT_FOUND') {
                throw error;
            }
        }
    }

    async _createInitialDocument(code) {
        try {
            const docRef = this.db.collection('twin-islands').doc(code);
            
            const initialData = {
                barreraElectromagneticaAbierta: false,
                start: "1",
                createdAt: new Date().toISOString(),
                resetAt: new Date().toISOString(),
                currentRoom: "playa-sur"
            };
            
            await docRef.set(initialData);
            console.log(`📄 Documento inicial creado para código: ${code}`);
            
        } catch (error) {
            console.error(`Error al crear documento inicial para ${code}:`, error);
            throw error;
        }
    }

    async _addIntroductionMessage(code) {
        try {
            const messagesRef = this.db.collection('twin-islands').doc(code).collection('messages');
            
            const introductionMessage = {
                message: `¡Bip-bip! Aquí Dron Johnson ya aterrizado, en misión por las Islas Gemelas. 🌊✨  
                
Estoy en la Playa Sur: acantilados, faro azul, barrera misteriosa y un teclado medio enterrado. Puedo explorar y sacar fotos de lo que me indiques 📸.  

La radiación impide que vengas, así que dame instrucciones y yo haré el trabajo. También te advierto que la radiación puede influir en los sistemas de comunicación, así que aseguraos de hablar mucho entre quienes estéis por allí.

¿Con ganas de descubrir los secretos de estas islas? 🤖`,
                user: "drone",
                timestamp: new Date().toISOString(),
                isIntroduction: true
            };
            
            await messagesRef.add(introductionMessage);
            console.log(`💬 Mensaje de introducción agregado para código: ${code}`);
            
        } catch (error) {
            console.error(`Error al agregar mensaje de introducción para ${code}:`, error);
            throw error;
        }
    }
}

module.exports = GameResetService;
