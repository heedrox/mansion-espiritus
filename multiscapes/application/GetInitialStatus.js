const MessageRepository = require('../infrastructure/MessageRepository');

class GetInitialStatus {
    static async execute({ code }) {
        console.log('Intentando obtener mensajes para:', code);
        
        // Obtener todos los mensajes ordenados por timestamp
        const messages = await MessageRepository.getMessagesByTimestamp(code);

        return {
            messages: messages,
            count: messages.length,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GetInitialStatus; 