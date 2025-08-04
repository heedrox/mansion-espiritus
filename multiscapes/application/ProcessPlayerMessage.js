const Message = require('../domain/Message');
const MessageStorer = require('../infrastructure/MessageStorer');
const DroneDataService = require('../infrastructure/DroneDataService');
const MessageRepository = require('../infrastructure/MessageRepository');
const DroneResponseGenerator = require('../domain/DroneResponseGenerator');
const GameStateService = require('../infrastructure/GameStateService');
const CheckCodes = require('../domain/checkCodes');

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
            
            // Verificar si el mensaje contiene algún código
            const codeMatch = message.match(/\b[A-Z]{4,}\b/gi);
            if (codeMatch) {
                const gameStateService = new GameStateService();
                
                for (const potentialCode of codeMatch) {
                    const codeResult = CheckCodes.checkCode(potentialCode);
                    
                    if (codeResult.isValid) {
                        console.log(`🔓 Código válido encontrado: ${codeResult.code}`);
                        console.log(`📋 Efecto: ${codeResult.effect}`);
                        
                        // Aplicar cambios de estado si existen
                        if (codeResult.stateChanges) {
                            for (const [key, value] of Object.entries(codeResult.stateChanges)) {
                                if (key === 'barreraElectromagneticaAbierta' && value === true) {
                                    await gameStateService.openBarrier();
                                    console.log('🔓 Barrera electromagnética abierta');
                                }
                            }
                        }
                        
                        break; // Solo procesar el primer código válido
                    }
                }
            }
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