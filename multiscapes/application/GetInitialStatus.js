const MessageRepository = require('../infrastructure/MessageRepository');
const GameStateService = require('../infrastructure/GameStateService');
const path = require('path');

class GetInitialStatus {
    static async execute({ code }) {
        // Obtener todos los mensajes ordenados por timestamp
        const messages = await MessageRepository.getMessagesByTimestamp(code);

        // Obtener el estado actual del juego
        const gameStateService = new GameStateService(code);
        const gameState = await gameStateService.getGameState();
        const currentRoomName = gameState.currentRoom || 'playa-sur';

        // Obtener el título de la habitación actual
        let currentRoomTitle = null;
        try {
            const gamesDataDir = path.resolve(__dirname, '../games-data');
            const roomFilePath = path.join(gamesDataDir, `${currentRoomName}.js`);
            const roomData = require(roomFilePath);
            currentRoomTitle = roomData.title || currentRoomName;
        } catch (error) {
            console.error('Error al cargar datos de la habitación:', error);
            currentRoomTitle = currentRoomName; // Fallback al nombre interno
        }

        return {
            messages: messages,
            count: messages.length,
            timestamp: new Date().toISOString(),
            currentRoom: currentRoomTitle
        };
    }
}

module.exports = GetInitialStatus; 