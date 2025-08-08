const ProcessPlayerMessage = require('./application/ProcessPlayerMessage');

module.exports = {
    multiscapes: async (request, response) => {
        // Configurar headers CORS
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.set('Access-Control-Allow-Headers', 'Content-Type');

        // Manejar la solicitud OPTIONS (preflight)
        if (request.method === 'OPTIONS') {
            response.status(204).send('');
            return;
        }

        try {
            // Obtener los valores del body de la petición
            const { code, message } = request.body;

            // Validar parámetros requeridos
            const validationError = _validate({ code, message });
            if (validationError) {
                return response.status(400).json(validationError);
            }

            // Ejecutar el caso de uso
            const droneResponse = await ProcessPlayerMessage.process({ code, message });

            // Convertir a respuesta JSON
            response.json({
                message: droneResponse.message,
                photoUrls: droneResponse.photoUrls || [],
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error al procesar la petición:', error);
            response.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }
}

function _validate({ code, message }) {
    if (!code) {
        return {
            error: 'El parámetro "code" es requerido'
        };
    }

    if (!message) {
        return {
            error: 'El parámetro "message" es requerido'
        };
    }

    return null; // No hay errores de validación
}

async function multiscapesInit(request, response) {
    // Configurar headers CORS
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar la solicitud OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }

    try {
        // Obtener parámetros de la query string
        const { code } = request.query;

        // Validar parámetros requeridos
        if (!code) {
            return response.status(400).json({
                error: 'El parámetro "code" es requerido'
            });
        }

        // Ejecutar el caso de uso
        const GetInitialStatus = require('./application/GetInitialStatus');
        const result = await GetInitialStatus.execute({ code });

        // Convertir a respuesta JSON
        response.json(result);

    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        response.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
}

module.exports.multiscapesInit = multiscapesInit;

// Endpoint de testing para probar desde navegador
async function multiscapesTest(request, response) {
    // Configurar headers CORS
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar la solicitud OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }

    try {
        // Obtener parámetros de la query string
        const { code, message } = request.query;

        // Validar parámetros requeridos
        const validationError = _validate({ code, message });
        if (validationError) {
            return response.status(400).json(validationError);
        }

        console.log('🧪 TEST ENDPOINT - Recibido code:', code, 'message:', message);

        // Ejecutar el caso de uso (igual que el endpoint principal pero desde GET)
        const ProcessPlayerMessage = require('./application/ProcessPlayerMessage');
        const droneResponse = await ProcessPlayerMessage.process({ code, message });

        // Convertir a respuesta JSON
        response.json({
            message: droneResponse.message,
            photoUrls: droneResponse.photoUrls || [],
            timestamp: new Date().toISOString(),
            testInfo: {
                receivedCode: code,
                receivedMessage: message,
                endpoint: 'multiscapesTest (GET)'
            }
        });

    } catch (error) {
        console.error('Error en endpoint de testing:', error);
        response.status(500).json({
            error: 'Error interno del servidor',
            details: error.message,
            testInfo: {
                endpoint: 'multiscapesTest (GET)',
                errorOccurred: true
            }
        });
    }
}

module.exports.multiscapesTest = multiscapesTest;

// Endpoint para reset de juego
async function multiscapesReset(request, response) {
    // Configurar headers CORS
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar la solicitud OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }

    // Solo permitir POST
    if (request.method !== 'POST') {
        return response.status(405).json({
            error: 'Método no permitido',
            details: 'Este endpoint solo acepta POST',
            allowedMethods: ['POST']
        });
    }

    try {
        // Obtener parámetros del body
        const { code } = request.body;

        // Validar parámetros requeridos
        if (!code) {
            return response.status(400).json({
                error: 'El parámetro "code" es requerido'
            });
        }

        console.log(`🔄 RESET ENDPOINT - Recibido code: ${code}`);

        // Ejecutar el reset del juego
        const GameResetService = require('./infrastructure/GameResetService');
        const resetService = new GameResetService();
        const result = await resetService.resetGame(code);

        // Convertir a respuesta JSON
        response.json({
            success: true,
            message: result.message,
            code: result.code,
            timestamp: new Date().toISOString(),
            resetInfo: {
                endpoint: 'multiscapesReset',
                action: 'game_reset'
            }
        });

    } catch (error) {
        console.error('Error en endpoint de reset:', error);
        response.status(500).json({
            error: 'Error interno del servidor',
            details: error.message,
            resetInfo: {
                endpoint: 'multiscapesReset',
                errorOccurred: true
            }
        });
    }
}

module.exports.multiscapesReset = multiscapesReset;