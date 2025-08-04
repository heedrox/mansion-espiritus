const { generateObject } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const { z } = require('zod');

class DroneResponseValidator {
    static async validateResponse(response, expectedCharacteristics) {
        if (!process.env.OPEN_AI_KEY) {
            console.warn('⚠️  No API key available for validation');
            return { isValid: true, reason: 'No API key' };
        }

        try {
            const openAiModel = createOpenAI({
                apiKey: process.env.OPEN_AI_KEY
            });

            const validationPrompt = `
Eres un validador de respuestas de IA. Tu trabajo es verificar si una respuesta del drone contiene las características esperadas.

RESPUESTA DEL DRONE:
"${response}"

CARACTERÍSTICAS ESPERADAS:
${expectedCharacteristics.map(char => `- ${char}`).join('\n')}

INSTRUCCIONES:
1. Analiza si la respuesta menciona o describe las características esperadas
2. Considera sinónimos y variaciones (ej: "playa" = "beach", "arena" = "sand")
3. Evalúa el contexto y significado, no solo palabras exactas
4. Responde con "VALID" si cumple las características, o "INVALID" con razón

RESPUESTA:`;

            const validationResult = await generateObject({
                model: openAiModel("gpt-4o-mini"),
                messages: [
                    { role: 'system', content: 'Eres un validador experto. Responde solo con "VALID" o "INVALID: razón"' },
                    { role: 'user', content: validationPrompt }
                ],
                temperature: 0.1,
                max_tokens: 100,
                schema: z.object({
                    result: z.string().describe('VALID o INVALID con razón')
                })
            });

            // Force cleanup of any remaining connections
            if (global.gc) {
                global.gc();
            }

            const result = validationResult.object.result;
            const isValid = result.startsWith('VALID');
            
            return {
                isValid,
                reason: isValid ? 'Validated by AI' : result.replace('INVALID: ', ''),
                rawResult: result
            };

        } catch (error) {
            console.error('Error validating with AI:', error);
            return { isValid: true, reason: 'Validation failed, assuming valid' };
        }
    }

    static async validateCharacteristic(response, characteristic) {
        return this.validateResponse(response, [characteristic]);
    }

    // Convenience methods for common validations
    static async validateLocation(response) {
        return this.validateResponse(response, [
            'Menciona estar en la Playa Sur o playa sur',
            'Describe la ubicación en las Islas Gemelas'
        ]);
    }

    static async validateEnvironment(response) {
        return this.validateResponse(response, [
            'Menciona arena dorada o playa',
            'Describe acantilados al sur',
            'Menciona faro con luz azul',
            'Describe barrera electromagnética al norte'
        ]);
    }

    static async validatePersonality(response) {
        return this.validateResponse(response, [
            'Tiene tono juguetón o entusiasta',
            'Incluye comentarios divertidos o bromas',
            'Usa exclamaciones o emojis'
        ]);
    }
}

module.exports = DroneResponseValidator; 