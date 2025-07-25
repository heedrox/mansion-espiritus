const DatabaseConfig = require('./DatabaseConfig');

class MessageStorer {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    static async store(message, code, drone) {
        if (!message) {
            throw new Error('Message is required');
        }
        if (!code) {
            throw new Error('Code is required');
        }
        if (!drone) {
            throw new Error('Drone is required');
        }

        const storer = new MessageStorer();
        return await storer._storeMessage(message, code, drone);
    }

    async _storeMessage(message, code, drone) {
        try {
            // Construir la ruta del documento usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code, drone);
            
            // Obtener referencia al documento del drone
            const docRef = this.db.doc(docPath);
            
            // Verificar que el documento existe
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new Error(`No se encontró el documento en la ruta: ${docPath}`);
            }

            // Guardar el mensaje en la subcolección messages
            const messagesRef = docRef.collection('messages');
            const messageData = message.toJSON();
            const result = await messagesRef.add(messageData);
            
            console.log('Mensaje guardado en la subcolección messages con ID:', result.id);
            return result.id;
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
            throw error;
        }
    }
}

module.exports = MessageStorer; 