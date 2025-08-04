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