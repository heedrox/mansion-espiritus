const Message = require('../domain/Message');
const MessageStorer = require('../infrastructure/MessageStorer');
const DroneDataService = require('../infrastructure/DroneDataService');
const MessageRepository = require('../infrastructure/MessageRepository');
const DroneResponseGenerator = require('../domain/DroneResponseGenerator');

class ProcessPlayerMessage {
    static async process({ code, drone, message }) {
        console.log('code', code);
        console.log('drone', drone);

        // Validar que el drone existe
        await DroneDataService.validateDrone(code, drone);

        // Si se proporcionó un mensaje, crearlo y guardarlo
        let messageId = null;
        if (message) {
            const timestamp = new Date().toISOString();
            const messageInstance = Message.createAsPlayer({ message, timestamp });
            messageId = await MessageStorer.store(messageInstance, code, drone);
            console.log('Mensaje del player guardado con ID:', messageId);
        }

        // Obtener todos los mensajes ordenados por timestamp (incluyendo el recién guardado)
        const messages = await MessageRepository.getMessagesByTimestamp(code, drone);
        
        // Generar respuesta usando DroneResponseGenerator
        const response = DroneResponseGenerator.generateResponse(messages);
        
        // Guardar la respuesta del drone en la base de datos (unos milisegundos después)
        if (response) {
            const droneTimestamp = new Date().toISOString();
            const droneMessageInstance = Message.create({ 
                message: response, 
                user: "drone", 
                timestamp: droneTimestamp 
            });
            await MessageStorer.store(droneMessageInstance, code, drone);
            console.log('Respuesta del drone guardada con ID');
        }
        
        return response;
    }
}

module.exports = ProcessPlayerMessage; 