const { tool } = require('ai');
const z = require('zod');
const CheckCodes = require('../checkCodes');
const GameStateService = require('../../infrastructure/GameStateService');

function createCheckCodesTool({ roomName, code, roomData }) {
    // Obtener lugares únicos donde se pueden usar códigos
    const validCodes = roomData?.validCodes || {};
    const uniqueWhereToUse = [...new Set(
        Object.values(validCodes)
            .map(code => code.whereToUse)
            .filter(whereToUse => !!whereToUse)
    )];
    console.log('🎯 Lugares donde se pueden usar códigos:', uniqueWhereToUse);
    if (!uniqueWhereToUse || uniqueWhereToUse.length === 0) {
        return []
    }
    return [ tool({
        name: 'checkCodes',
        description: 'Verifica si un código alfanumerico es válido para desbloquear puertas, teclados, etc. y retorna sus efectos',
        inputSchema: z.object({
            code: z.string().describe('Sirve para confirmar si un codigo es valido para desbloquear algo, como un teclado, una puerta, etc. Debe ser invocado expresamente cuando el usuario indica ese código.'),
            whereToUse: z.enum(uniqueWhereToUse).describe('El lugar donde se quiere usar el código, como un teclado, una puerta, etc.'),
            justification: z.string().describe('Justifica por qué crees que hay que invocar esta tool, haciendo mención a la frase indicada por el usuario y cómo se relaciona con la necesidad de usar la tool')
        }),
        execute: async ({ code: inputCode, whereToUse, justification }) => {
            console.log(`🔍 Tool checkcode - Código: ${inputCode} - Lugar: ${whereToUse} - Justificación: ${justification}`);
            const result = CheckCodes.checkCode(inputCode, roomName, whereToUse);
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
