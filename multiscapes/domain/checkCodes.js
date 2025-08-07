const { z } = require('zod');

// Schema para la respuesta de checkCodes
const CheckCodesResponseSchema = z.object({
    isValid: z.boolean(),
    code: z.string(),
    effect: z.string().optional(),
    stateChanges: z.record(z.any()).optional(),
    message: z.string()
});

class CheckCodes {
    /**
     * Verifica si un código es válido y retorna sus efectos
     * @param {string} code - El código a verificar
     * @returns {Object} - Resultado de la verificación
     */
    static checkCode(code) {
        console.log('checkCode', code)
        const upperCode = code.toUpperCase().trim();
        
        // Definir códigos válidos y sus efectos
        const validCodes = {
            'DOTBA': {
                isValid: true,
                effect: 'Abre la barrera electromagnética',
                stateChanges: {
                    barreraElectromagneticaAbierta: true
                },
                message: 'Código DOTBA válido. La barrera electromagnética se ha abierto.'
            }
        };
        
        // Verificar si el código existe
        if (validCodes[upperCode]) {
            return {
                ...validCodes[upperCode],
                code: upperCode
            };
        }
        
        // Código no válido
        return {
            isValid: false,
            code: upperCode,
            message: `Código "${upperCode}" no reconocido. Intenta con otro código.`
        };
    }
    
    /**
     * Valida la respuesta usando el schema
     * @param {Object} response - La respuesta a validar
     * @returns {Object} - La respuesta validada
     */
    static validateResponse(response) {
        return CheckCodesResponseSchema.parse(response);
    }
}

module.exports = CheckCodes; 