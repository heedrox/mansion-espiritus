const Message = require('../domain/Message');
const MessageStorer = require('../infrastructure/MessageStorer');
const DroneDataService = require('../infrastructure/DroneDataService');
const MessageRepository = require('../infrastructure/MessageRepository');
const DroneResponseGenerator = require('../domain/DroneResponseGenerator');

class ProcessPlayerMessage {
    static async process({ code, message }) {
        const startTime = Date.now();
        console.log(`🚀 Iniciando procesamiento de mensaje para código: ${code}`);
        console.log(`📝 Mensaje del usuario: "${message}"`);

        try {
            // Validar que el juego existe
            console.log(`🔍 Validando existencia del juego...`);
            await DroneDataService.validateGame(code);
            console.log(`✅ Juego validado correctamente`);

            // Si se proporcionó un mensaje, crearlo y guardarlo
            let messageId = null;
            if (message) {
                console.log(`💾 Guardando mensaje del usuario...`);
                const timestamp = new Date().toISOString();
                const messageInstance = Message.createAsPlayer({ message, timestamp });
                messageId = await MessageStorer.store(messageInstance, code);
                console.log(`✅ Mensaje del player guardado con ID: ${messageId}`);
            }

            // Obtener todos los mensajes ordenados por timestamp (incluyendo el recién guardado)
            console.log(`📚 Obteniendo historial de mensajes...`);
            const allMessages = await MessageRepository.getMessagesByTimestamp(code);
            console.log(`📊 Total de mensajes en historial: ${allMessages.length}`);
            
            // Limitar a solo los últimos 30 mensajes para ahorrar costes
            const messages = allMessages.slice(-30);
            console.log(`📋 Mensajes enviados a AI: ${messages.length} (últimos 30)`);
            
            // Generar respuesta usando DroneResponseGenerator
            console.log(`🤖 Generando respuesta del drone...`);
            const droneResponseStart = Date.now();
            const droneResponse = await DroneResponseGenerator.generateResponse(messages, code);
            const droneResponseDuration = Date.now() - droneResponseStart;
            console.log(`✅ Respuesta del drone generada en ${droneResponseDuration}ms`);
            
            // Guardar la respuesta del drone en la base de datos (unos milisegundos después)
            if (droneResponse && droneResponse.message) {
                console.log(`💾 Guardando respuesta del drone...`);
                const droneTimestamp = new Date().toISOString();
                const droneMessageInstance = Message.create({ 
                    message: droneResponse.message, 
                    user: "drone", 
                    timestamp: droneTimestamp,
                    photoUrls: droneResponse.photoUrls || []
                });
                await MessageStorer.store(droneMessageInstance, code);
                console.log(`✅ Respuesta del drone guardada`);
            }
            
            const totalDuration = Date.now() - startTime;
            console.log(`🎯 Procesamiento completado en ${totalDuration}ms total`);
            
            return droneResponse;
        } catch (error) {
            const totalDuration = Date.now() - startTime;
            console.error(`❌ Error en procesamiento después de ${totalDuration}ms:`, error);
            throw error;
        }
    }
}

module.exports = ProcessPlayerMessage; 