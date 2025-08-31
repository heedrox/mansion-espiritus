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
            
            // Cargar el título de la habitación inicial
            let initialRoomTitle = 'playa-sur'; // Fallback al nombre interno
            try {
                const path = require('path');
                const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
                const roomFilePath = path.join(gamesDataDir, 'playa-sur.js');
                const roomData = require(roomFilePath);
                initialRoomTitle = roomData.title || 'playa-sur';
            } catch (error) {
                console.error('Error al cargar datos de la habitación inicial:', error);
                // Mantener el fallback al nombre interno
            }
            
            const initialData = {
                barreraElectromagneticaAbierta: false,
                piramideAbierta: false,
                start: "1",
                createdAt: new Date().toISOString(),
                resetAt: new Date().toISOString(),
                currentRoom: "playa-sur",
                currentRoomTitle: initialRoomTitle
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
                message: `¡Bip-bip! 🤖 Aquí Dron Johnson, en misión por las Islas Gemelas 🌴✨
La radiación ☢️ impide que los humanos entren; por eso me enviaron a mí.

<b>Vuestra misión</b>: descubrir qué esconden estas tierras prohibidas 🗿💎. Se dice que aquí vivió una civilización antiquísima y, con ella, tesoros ocultos.

Puedo volar 🚁 y sacar fotos 📸, pero la radiación las distorsiona: no os fiéis de todo lo que muestre mi cámara.

He aterrizado en la Playa Sur 🏖️. Al norte vibra una barrera electromagnética ⚡ que bloquea el acceso a la Playa Norte, vuestro objetivo. Primer reto: desactivarla.

¿Cuál será vuestra primera orden? 🗺️`,
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
