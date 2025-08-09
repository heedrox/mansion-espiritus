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
     * @param {string} roomName - La habitación actual donde se introduce el código
     * @returns {Object} - Resultado de la verificación
     */
    static checkCode(code, roomName = null) {
        console.log('checkCode', code, 'en habitación:', roomName);
        const upperCode = code.toUpperCase().trim();
        
        // Obtener códigos válidos de la habitación actual
        let validCodes = {};
        
        if (roomName) {
            try {
                const path = require('path');
                const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
                const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
                const roomData = require(jsFilePath);
                
                if (roomData.validCodes) {
                    validCodes = roomData.validCodes;
                    console.log(`📋 Códigos válidos cargados para ${roomName}:`, Object.keys(validCodes));
                } else {
                    console.warn(`⚠️ No hay códigos definidos para la habitación "${roomName}"`);
                }
            } catch (error) {
                console.error(`❌ Error al cargar códigos para habitación "${roomName}":`, error.message);
                // Fallback a códigos centralizados (compatibilidad hacia atrás)
                validCodes = this._getLegacyCodes();
            }
        } else {
            // Si no se proporciona habitación, usar códigos centralizados (compatibilidad hacia atrás)
            console.warn('⚠️ No se proporcionó habitación, usando códigos centralizados');
            validCodes = this._getLegacyCodes();
        }
        
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
     * Códigos centralizados para compatibilidad hacia atrás
     * @returns {Object} - Códigos válidos centralizados
     */
    static _getLegacyCodes() {
        return {
            'DOTBA': {
                isValid: true,
                effect: 'Abre la barrera electromagnética',
                stateChanges: {
                    barreraElectromagneticaAbierta: true
                },
                message: 'Código DOTBA válido. La barrera electromagnética se ha abierto.'
            },
            '8462': {
                isValid: true,
                effect: 'Abre la pirámide',
                stateChanges: {
                    piramideAbierta: true
                },
                message: 'Código 8462 válido. La pirámide se abre majestuosamente, revelando los tesoros ancestrales y secretos milenarios de una civilización perdida en el tiempo. ¿Entramos?'
            }
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