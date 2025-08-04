const DatabaseConfig = require('./DatabaseConfig');

class MessageRepository {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    static async getMessagesByTimestamp(code) {
        if (!code) {
            throw new Error('Code is required');
        }

        const repository = new MessageRepository();
        return await repository._getMessagesByTimestamp(code);
    }

    async _getMessagesByTimestamp(code) {
        try {
            // Construir la ruta de la subcolección messages usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code);
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