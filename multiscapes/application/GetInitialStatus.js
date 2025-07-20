const MessageRepository = require('../infrastructure/MessageRepository');

class GetInitialStatus {
    static async execute({ code, drone }) {
        console.log('Intentando obtener mensajes para:', code, drone);
        
        // Obtener todos los mensajes ordenados por timestamp
        const messages = await MessageRepository.getMessagesByTimestamp(code, drone);

        return {
            messages: messages,
            count: messages.length,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GetInitialStatus; 