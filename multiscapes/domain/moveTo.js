const GameStateService = require('../infrastructure/GameStateService');
const path = require('path');

class MoveTo {
    static async moveTo(destination, code) {
        try {
            // Obtener el estado actual del juego
            const gameStateService = new GameStateService(code);
            const gameState = await gameStateService.getGameState();
            const currentRoom = gameState.currentRoom || 'playa-sur';

            // Cargar los datos de la ubicación actual
            const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
            const jsFilePath = path.join(gamesDataDir, `${currentRoom}.js`);
            const roomData = require(jsFilePath);

            // Verificar si el destino está disponible
            if (!roomData.availableDestinations || typeof roomData.availableDestinations.getDestinations !== 'function') {
                return {
                    success: false,
                    message: `No puedo ir a ${destination}. No hay destinos disponibles desde esta ubicación.`,
                    reason: 'no_available_destinations'
                };
            }

            const availableDestinations = roomData.availableDestinations.getDestinations(gameState);

            if (!availableDestinations.includes(destination)) {
                return {
                    success: false,
                    message: `No puedo ir a ${destination}. No es un destino válido desde esta ubicación.`,
                    reason: 'invalid_destination'
                };
            }

            // Cargar los datos de la habitación de destino para obtener el título
            let destinationTitle = destination; // Fallback al nombre interno
            try {
                const destinationFilePath = path.join(gamesDataDir, `${destination}.js`);
                const destinationData = require(destinationFilePath);
                destinationTitle = destinationData.title || destination;
            } catch (error) {
                console.error('Error al cargar datos de la habitación de destino:', error);
                // Mantener el fallback al nombre interno
            }

            // Actualizar la ubicación actual y el título en Firestore
            await gameStateService.applyStateChanges({
                currentRoom: destination,
                currentRoomTitle: destinationTitle
            });

            return {
                success: true,
                message: `¡Movimiento exitoso! Ahora estoy en ${destination}.`,
                destination: destination,
                previousRoom: currentRoom
            };

        } catch (error) {
            console.error('Error al mover el dron:', error);
            return {
                success: false,
                message: `Hubo un error al intentar moverme a ${destination}.`,
                reason: 'error'
            };
        }
    }
}

module.exports = MoveTo;
