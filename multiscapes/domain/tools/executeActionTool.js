const { tool } = require('ai');
const z = require('zod');
const ExecuteAction = require('../executeAction');


function createExecuteActionTool({ roomData, code }) {
    const allowedActions = Object.keys(roomData.actions || {});

    if (Array.isArray(allowedActions) && allowedActions.length === 0) {
        return []
    }

    return [ tool({
        name: 'executeAction',
        description: 'Ejecuta una acción del juego definida en la habitación actual y actualiza el estado del juego',
        inputSchema: z.object({
            action: z.enum(allowedActions).describe('El enum de la acción a ejecutar, definida en actions del juego actual'),
            reason: z.string().describe('Por qué ejecutas esta acción ahora')
        }),
        execute: async ({ action, reason }) => {
            console.log(`🛠️ Tool executeAction - Acción: ${action} - Razón: ${reason}`);
            const result = await ExecuteAction.executeAction(action, code);
            console.log(`📋 Resultado executeAction: ${result.success ? 'Éxito' : 'Fallo'} - ${result.message}`);
            return result;
        }
    }) ];
}



module.exports = { createExecuteActionTool };
