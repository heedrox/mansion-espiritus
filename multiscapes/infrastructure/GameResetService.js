const DatabaseConfig = require('./DatabaseConfig');
const admin = require('firebase-admin');

class GameResetService {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    async resetGame(code) {
        try {
            // Eliminar documento y subcolecciones si existen
            await this._deleteDocumentAndSubcollections(code);

            // Crear documento inicial
            await this._createInitialDocument(code);

            // Añadir mensaje de introducción
            await this._addIntroductionMessage(code);

            console.log('✅ Juego reseteado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al resetear el juego:', error);
            return false;
        }
    }

    async _deleteDocumentAndSubcollections(code) {
        try {
            const docRef = this.db.collection('twin-islands').doc(code);
            
            // Obtener todas las subcolecciones
            const collections = await docRef.listCollections();
            for (const collection of collections) {
                const snapshot = await collection.get();
                const batch = this.db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }

            // Eliminar documento principal
            await docRef.delete();
            console.log(`🧹 Documento y subcolecciones eliminados para el código: ${code}`);
        } catch (error) {
            console.error('Error al eliminar documento y subcolecciones:', error);
            throw error;
        }
    }

    async _createInitialDocument(code) {
        try {
            const docRef = this.db.collection('twin-islands').doc(code);
            
            const initialData = {
                barreraElectromagneticaAbierta: false,
                piramideAbierta: false,
                start: "1",
                createdAt: new Date().toISOString(),
                resetAt: new Date().toISOString(),
                currentRoom: "playa-sur"
            };
            
            await docRef.set(initialData);
            console.log('🆕 Documento inicial creado:', initialData);
        } catch (error) {
            console.error('Error al crear documento inicial:', error);
            throw error;
        }
    }

    async _addIntroductionMessage(code) {
        try {
            const messagesRef = this.db.collection('twin-islands').doc(code).collection('messages');
            
            const introductionMessage = {
                message: `¡Bip-bip! Aquí Dron Johnson ya aterrizado, en misión por las Islas Gemelas. 🌊✨  
Estoy en la Playa Sur. Aquí hay una barrera electromagnética al norte y signos extraños en los acantilados. ¿Por dónde empezamos?`,
                user: 'drone',
                timestamp: new Date().toISOString()
            };
            
            await messagesRef.add(introductionMessage);
            console.log('✉️ Mensaje de introducción añadido');
        } catch (error) {
            console.error('Error al añadir mensaje de introducción:', error);
            throw error;
        }
    }
}

module.exports = GameResetService;
