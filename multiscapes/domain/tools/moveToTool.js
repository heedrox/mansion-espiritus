const { tool } = require('ai');
const z = require('zod');
const MoveTo = require('../moveTo');

function createMoveToTool({ roomData, code, gameState }) {

            // Construir dinámicamente la lista de destinos permitidos para el schema del tool moveTo
    const allowedDestinations = _getAvailableDestinations(roomData, gameState);

    if (!allowedDestinations || allowedDestinations.length === 0) {
        return []
    }

    // Cuando no haya destinos disponibles, usamos string para evitar que z.enum([]) falle
    const destinationSchema = (Array.isArray(allowedDestinations) && allowedDestinations.length > 0)
        ? z.enum(allowedDestinations)
        : z.string();

    return [ tool({
        name: 'moveTo',
        description: 'Mueve el dron a una ubicación específica si está disponible',
        inputSchema: z.object({
            destination: destinationSchema.describe('El destino al que quieres mover el dron. Debe ser uno de los destinos disponibles desde tu ubicación actual.'),
            reason: z.string().describe('Por qué necesitas mover el dron a este destino')
        }),
        execute: async ({ destination, reason }) => {
            console.log(`🚀 Tool MoveTo - Destino: ${destination} - Razón: ${reason}`);
            const result = await MoveTo.moveTo(destination, code);
            console.log(`📋 Resultado: ${result.success ? 'Éxito' : 'Fallo'} - ${result.message}`);
            
            return result;
        }
    }) ];
}

function _getAvailableDestinations(roomData, gameState = {}) {
    try {
        if (!roomData.availableDestinations || typeof roomData.availableDestinations.getDestinations !== 'function') {
            return [];
        }
        const destinations = roomData.availableDestinations.getDestinations(gameState);
        if (!Array.isArray(destinations)) {
            return [];
        }
        // Asegurar valores únicos y de tipo string
        const unique = Array.from(new Set(destinations.filter(d => typeof d === 'string' && d.trim().length > 0)));
        return unique;
    } catch (error) {
        console.warn(`⚠️ No se pudieron obtener destinos disponibles para "${roomData.title}":`, error.message);
        return [];
    }
}

module.exports = { createMoveToTool };
