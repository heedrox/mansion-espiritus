const DatabaseConfig = require('./DatabaseConfig');

class MessageRepository {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    static async getMessagesByTimestamp(code, drone) {
        if (!code) {
            throw new Error('Code is required');
        }
        if (!drone) {
            throw new Error('Drone is required');
        }

        const repository = new MessageRepository();
        return await repository._getMessagesByTimestamp(code, drone);
    }

    async _getMessagesByTimestamp(code, drone) {
        try {
            // Construir la ruta de la subcolección messages usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code, drone);
            const messagesPath = `${docPath}/messages`;
            console.log('Obteniendo mensajes de:', messagesPath);
            
            // Obtener todos los mensajes ordenados por timestamp
            const messagesRef = this.db.collection(messagesPath);
            const snapshot = await messagesRef.orderBy('timestamp', 'asc').get();
            
            const messages = [];
            snapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            console.log(`Obtenidos ${messages.length} mensajes`);
            return messages;
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            throw error;
        }
    }
}

module.exports = MessageRepository; 