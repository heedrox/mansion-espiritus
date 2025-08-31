const { tool } = require('ai');
const z = require('zod');
const CheckCodes = require('../checkCodes');
const GameStateService = require('../../infrastructure/GameStateService');

function createCheckCodesTool({ roomName, code }) {
    return [ tool({
        name: 'checkCodes',
        description: 'Verifica si un código es válido y retorna sus efectos',
        inputSchema: z.object({
            code: z.string().describe('El código a verificar'),
            reason: z.string().describe('Por qué necesitas verificar este código')
        }),
        execute: async ({ code: inputCode, reason }) => {
            console.log(`🔍 ¡¡¡TOOL CHECKCODE INVOCADA!!! - Código: ${inputCode} - Razón: ${reason}`);
            const result = CheckCodes.checkCode(inputCode, roomName);
            console.log(`📋 Resultado: ${result.isValid ? 'Válido' : 'Inválido'} - ${result.message}`);
            console.log(`📊 StateChanges:`, result.stateChanges);
            
            // Aplicar cambios de estado si el código es válido
            if (result.isValid && result.stateChanges) {
                console.log(`🔄 Aplicando cambios de estado...`);
                
                const gameStateService = new GameStateService(code);                
                await gameStateService.applyStateChanges(result.stateChanges);
            }
            
            return result;
        }
    }) ];
}

module.exports = { createCheckCodesTool };
