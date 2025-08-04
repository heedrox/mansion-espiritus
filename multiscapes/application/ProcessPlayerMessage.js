const Message = require('../domain/Message');
const MessageStorer = require('../infrastructure/MessageStorer');
const DroneDataService = require('../infrastructure/DroneDataService');
const MessageRepository = require('../infrastructure/MessageRepository');
const DroneResponseGenerator = require('../domain/DroneResponseGenerator');

class ProcessPlayerMessage {
    static async process({ code, message }) {
        console.log('code', code);

        // Validar que el juego existe
        await DroneDataService.validateGame(code);

        // Si se proporcionó un mensaje, crearlo y guardarlo
        let messageId = null;
        if (message) {
            const timestamp = new Date().toISOString();
            const messageInstance = Message.createAsPlayer({ message, timestamp });
            messageId = await MessageStorer.store(messageInstance, code);
            console.log('Mensaje del player guardado con ID:', messageId);
            

        }

        // Obtener todos los mensajes ordenados por timestamp (incluyendo el recién guardado)
        const messages = await MessageRepository.getMessagesByTimestamp(code);
        
        // Generar respuesta usando DroneResponseGenerator
        const droneResponse = await DroneResponseGenerator.generateResponse(messages);
        
        // Guardar la respuesta del drone en la base de datos (unos milisegundos después)
        if (droneResponse && droneResponse.message) {
            const droneTimestamp = new Date().toISOString();
            const droneMessageInstance = Message.create({ 
                message: droneResponse.message, 
                user: "drone", 
                timestamp: droneTimestamp,
                photoUrls: droneResponse.photoUrls || []
            });
            await MessageStorer.store(droneMessageInstance, code);
            console.log('Respuesta del drone guardada con ID');
        }
        
        return droneResponse;
    }
}

module.exports = ProcessPlayerMessage; 