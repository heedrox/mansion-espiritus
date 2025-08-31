const { generateText, tool, Output, stepCountIs, zodSchema } = require('ai');
const z = require('zod');
const { createOpenAI } = require('@ai-sdk/openai');
const DroneResponse = require('./DroneResponse');
const GameStateService = require('../infrastructure/GameStateService');
const CheckCodes = require('./checkCodes');
const MoveTo = require('./moveTo');
const ExecuteAction = require('./executeAction');
const PromptGenerator = require('./PromptGenerator');
const fs = require('fs');
const path = require('path');

let TIMER
class DroneResponseGenerator {
    static async generateResponse(messages, code) {
        const time1 = Date.now();
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Messages debe ser un array');
        }

        // Obtener el estado actual del juego
        const gameStateService = new GameStateService(code);
        const gameState = await gameStateService.getGameState();

        // Convertir mensajes al formato esperado por la AI SDK
        const aiMessages = messages.map(({ user, message }) => ({
            role: user === 'player' ? 'user' : 'assistant',
            content: message
        }));

        // Crear el modelo de OpenAI
        const openAiModel = createOpenAI({
            apiKey: process.env.OPEN_AI_KEY
        });

        // Definir el prompt del sistema dependiente de la ubicación y concatenar instrucciones comunes
        const roomName = gameState.currentRoom;
        const johnsonPrompt = PromptGenerator.getRoomPrompt(roomName, gameState);
        const commonInstructions = this._getCommonInstructions();
        const gameStateJsonBlock = this._getGameStateJsonBlock(gameState);
        const systemPrompt = johnsonPrompt + commonInstructions + gameStateJsonBlock;

        // Construir dinámicamente la lista de destinos permitidos para el schema del tool moveTo
        const allowedDestinations = this._getAvailableDestinations(roomName, gameState);
        // Cuando no haya destinos disponibles, usamos string para evitar que z.enum([]) falle
        const destinationSchema = (Array.isArray(allowedDestinations) && allowedDestinations.length > 0)
            ? z.enum(allowedDestinations)
            : z.string();

        // Construir dinámicamente la lista de acciones disponibles para el schema del tool executeAction
        let allowedActions = [];
        try {
            const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
            const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
            const roomData = require(jsFilePath);
            allowedActions = Object.keys(roomData.actions || {});
        } catch (err) {
            console.warn(`⚠️ No se pudieron cargar las actions para room "${roomName}":`, err.message);
        }
        // Cuando no haya actions disponibles, usamos string para evitar que z.enum([]) falle
        const actionSchema = (Array.isArray(allowedActions) && allowedActions.length > 0)
            ? z.enum(allowedActions)
            : z.string();

        const time2 = Date.now();
        const duration = time2 - time1;
        console.log(`🤖 HASTA SYSTEM PROMPT: ${duration}ms`);
        // console.log('🤖 SYSTEM PROMPT:', systemPrompt);
        try {
            /*console.log('🚀 Iniciando llamada a GPT-4o-mini...');
            console.log('📊 Parámetros de la llamada:');
            console.log('   - Modelo: gpt-4o-mini');
            console.log('   - Temperature: 0.7');
            console.log('   - Max tokens: 2000');
            console.log('   - Max steps: 5');
            console.log('   - Mensajes: ', aiMessages.length);
            console.log('   - Prompt del sistema: ', systemPrompt.length, 'caracteres');
            */
           
            const startTime = Date.now();
            
            const response = await generateText({
                model: openAiModel("gpt-4o-mini"),
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...aiMessages
                ],
                temperature: 0.7,
                max_tokens: 2000,
                experimental_output: Output.object({
                    schema: z.object({
                        message: z.string().describe('La respuesta del dron al usuario'),
                        photoUrls: z.array(z.string().url()).describe('Array de URLs de fotos que el dron quiere mostrar al usuario')
                    })
                }),
                stopWhen: stepCountIs(3),
                /*stopWhen: (step) => {
                    // Si ya hemos hecho tool calls, continuar hasta generar texto
                    if (step.toolCalls && step.toolCalls.length > 0) {
                        return step.text && step.text.length > 0;
                    }
                    // Si no hemos hecho tool calls, permitir hasta 3 steps
                    return step.step >= 3;
                },*/
                
                // maxSteps no es un parámetro válido en AI SDK 5
                tools: [
                    tool({
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
                                const GameStateService = require('../infrastructure/GameStateService');
                                const gameStateService = new GameStateService(code);
                                
                                await gameStateService.applyStateChanges(result.stateChanges);
                            }
                            
                            return result;
                        }
                    }),
                    tool({
                        name: 'moveTo',
                        description: 'Mueve el dron a una ubicación específica si está disponible',
                        inputSchema: z.object({
                            destination: destinationSchema.describe('El destino al que quieres mover el dron. Debe ser uno de los destinos disponibles desde tu ubicación actual.'),
                            reason: z.string().describe('Por qué necesitas mover el dron a este destino')
                        }),
                        execute: async ({ destination, reason }) => {
                            console.log(`🚀 ¡¡¡TOOL MOVETO INVOCADA!!! - Destino: ${destination} - Razón: ${reason}`);
                            const result = await MoveTo.moveTo(destination, code);
                            console.log(`📋 Resultado: ${result.success ? 'Éxito' : 'Fallo'} - ${result.message}`);
                            
                            return result;
                        }
                    }),
                    tool({
                        name: 'executeAction',
                        description: 'Ejecuta una acción del juego definida en la habitación actual y actualiza el estado del juego',
                        inputSchema: z.object({
                            action: actionSchema.describe('El enum de la acción a ejecutar, definida en actions del juego actual'),
                            reason: z.string().describe('Por qué ejecutas esta acción ahora')
                        }),
                        execute: async ({ action, reason }) => {
                            console.log(`🛠️ ¡¡¡TOOL EXECUTEACTION INVOCADA!!! - Acción: ${action} - Razón: ${reason}`);
                            const result = await ExecuteAction.executeAction(action, code);
                            console.log(`📋 Resultado executeAction: ${result.success ? 'Éxito' : 'Fallo'} - ${result.message}`);
                            return result;
                        }
                    })
                ],
                // Añadir callbacks para monitorear los steps
                onStep: (step) => {
                    console.log(`🔄 STEP ${step.step}: ${step.name || 'Sin nombre'} - ${step.type || 'Sin tipo'}`);
                    if (step.input) {
                        console.log(`   📥 Input del step:`, JSON.stringify(step.input, null, 2));
                    }
                    if (step.output) {
                        console.log(`   📤 Output del step:`, JSON.stringify(step.output, null, 2));
                    }
                },
                onFinal: (completion) => {
                    console.log(`✅ COMPLETADO - Total de steps: ${completion.steps?.length || 'N/A'}`);
                    if (completion.steps) {
                        completion.steps.forEach((step, index) => {
                            console.log(`   📋 Step ${index + 1}: ${step.name || 'Sin nombre'} - ${step.type || 'Sin tipo'}`);
                        });
                    }
                }
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`🎯 Llamada a GPT completada en ${duration}ms`);
            console.log(`📊 Respuesta recibida:`, {
               hasMessage: !!response.experimental_output?.message,
                messageLength: response.experimental_output?.message?.length || 0,
                hasPhotoUrls: !!response.experimental_output?.photoUrls,
                photoUrlsCount: response.experimental_output?.photoUrls?.length || 0,
                hasText: !!response.text,
                textLength: response.text?.length || 0,
                finishReason: response.finishReason,
                steps: response.steps?.length || 0
            });
            
            console.log(`📸 Photo URLs: ${JSON.stringify(response.experimental_output?.photoUrls || [])}`);
            
            // Extraer el mensaje y las URLs de fotos del resultado
            let finalMessage = response.experimental_output?.message || response.text || 
                              'No se pudo generar respuesta ? POR CUA';
            
            console.log(`🤖 Drone Response: ${finalMessage}`);
            // Extraer URLs de fotos del texto si no están en el output estructurado
            let photoUrls = response.experimental_output?.photoUrls || [];
            if (photoUrls.length === 0 && response.text) {
                // Buscar URLs de fotos en el texto usando regex
                const urlRegex = /https:\/\/[^\s\)\]]+/g;
                const foundUrls = response.text.match(urlRegex) || [];
                photoUrls = foundUrls.filter(url => 
                    url.includes('miniscapes.web.app') && 
                    (url.includes('.jpg') || url.includes('.png') || url.includes('.mp4'))
                );
            }
            
            // Filtrar photoUrls para evitar alucinaciones - solo permitir URLs que existen en los media de la habitación
            const filteredPhotoUrls = this._filterValidPhotoUrls(photoUrls, roomName, gameState);
            
            // Con maxSteps: 3, el modelo debería completar la tarea en un solo paso
            // y devolver el resultado directamente en experimental_output
            
            return DroneResponse.create(finalMessage, filteredPhotoUrls);
        } catch (error) {
           // const endTime = Date.now();
            // const duration = endTime - startTime;
            
            console.error(`❌ Error al generar respuesta con AI`, error);
            console.error(`🔍 Detalles del error:`, {
                name: error.name,
                message: error.message,
                stack: error.stack,
                code: error.code,
                status: error.status,
                statusText: error.statusText
            });
            
            // Detectar timeouts específicos
            if (error.message?.includes('timeout') || error.code === 'ECONNABORTED' || duration > 30000) {
                console.error(`⏰ TIMEOUT DETECTADO - La llamada tardó ${duration}ms`);
            }
            
            // Detectar errores de rate limiting
            if (error.status === 429 || error.message?.includes('rate limit')) {
                console.error(`🚫 RATE LIMIT DETECTADO`);
            }
            
            // Detectar errores de API key
            if (error.status === 401 || error.message?.includes('unauthorized') || error.message?.includes('invalid api key')) {
                console.error(`🔑 ERROR DE API KEY`);
            }
            
            return DroneResponse.create(`Hubo un error procesando tu mensaje, no te entendí bien. Inténtalo nuevamente.`);
        }
    }

    static _getJohnsonPrompt() {
        // Compatibilidad hacia atrás: usar playa-sur por defecto
        return PromptGenerator.getRoomPrompt('playa-sur');
    }

    static _formatRoomLabel(roomName) {
        try {
            return (roomName || '')
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
        } catch {
            return roomName;
        }
    }

    static _getRoomPrompt(roomName, gameState = {}) {
        return PromptGenerator.getRoomPrompt(roomName, gameState);
    }

    static _composeMediaSectionFromJson(mediaItems, locationLabel = 'la zona') {
        let output = `# ARCHIVOS DISPONIBLES EN TU ZONA:\nEl dron ha capturado las siguientes imágenes y vídeos desde ${locationLabel}.\nNO puedes enviar fotos de otros objetos. Si el operador te lo pide, indica que no ves relevancia a ese objeto.\nEstán disponibles para mostrar al operador durante la exploración:`;

        mediaItems.forEach((item, index) => {
            const number = index + 1;
            const isPhoto = (item.type || '').toLowerCase() === 'photo';
            const isVideo = (item.type || '').toLowerCase() === 'video';
            const icon = isPhoto ? '📷' : (isVideo ? '🎥' : '📦');
            const kindLabel = isPhoto ? 'Foto' : (isVideo ? 'Vídeo' : 'Item');
            const title = item.title || 'Sin título';
            const url = item.url || '';
            const descriptionLines = Array.isArray(item.description) ? item.description : [];

            output += `\n\n${icon} ${kindLabel} ${number}: ${title} - ${url}`;
            if (descriptionLines.length > 0) {
                descriptionLines.forEach(line => {
                    output += `\n- ${line}`;
                });
            }
            output += `\n\n---`;
        });

        // Remove trailing separator if any media exists
        if (mediaItems.length > 0) {
            output = output.replace(/\n\n---$/, '');
        }

        return output;
    }

    static _composeDestinationsSection(data, gameState) {
        if (!data.availableDestinations || typeof data.availableDestinations.getDestinations !== 'function') {
            return '';
        }

        const destinations = data.availableDestinations.getDestinations(gameState);
        const description = data.availableDestinations.description || '';

        if (destinations.length === 0) {
            return `# DESTINOS DISPONIBLES:
Actualmente no puedes ir a ningún lado desde esta ubicación. ${description}`;
        }

        const destinationsList = destinations.map(dest => `- ${dest}`).join('\n');
        return `# DESTINOS DISPONIBLES:
Puedes ir a los siguientes lugares:
${destinationsList}

${description}`;
    }

    static _getMediaGuidelines() {
        return `
        
- RECUERDA: Solo envia archivos / fotos / vídeos de esos objetos.
- Si el usuario te pide foto de un elemento que no tienes, indica que no ves relevancia a ese objeto como para tomar una foto.
- Solo incluye la URL en photoUrls cuando el usuario explore específicamente ese objeto. NUNCA incluyas URLs en el texto del mensaje. El texto debe ser solo tu respuesta verbal.
- NUNCA escribas URLs en el campo message. Las URLs van SOLO en photoUrls.

CUANDO ENVÍES UNA FOTO:
Si incluyes una foto en photoUrls, tu mensaje DEBE tener dos partes OBLIGATORIAS:
1. Primero, describe lo que ves o has encontrado, con tu personalidad habitual.
2. Después, SIEMPRE añade una frase que indique que estás enviando la foto. Ejemplos OBLIGATORIOS:
   - "Te envío la foto."
   - "Aquí tienes la imagen que acabo de tomar."
   - "¡He escaneado el objeto! Te adjunto la foto a través del sistema."
   - "¡Mira lo que he encontrado! Te paso la foto."
   - "¡Foto lista! Te la envío ahora mismo."`;
    }

    static _getCommonInstructions() {
        return `

# INSTRUCCIONES DE COMPORTAMIENTO:
- Puedes mencionar qué elementos hay en tu ubicación, pero NO des descripciones detalladas a menos que el usuario te pregunte específicamente por algo. Si te preguntan "¿qué hay por aquí?" solo menciona los elementos VISIBLES INMEDIATAMENTE. Los elementos que requieren exploración detallada solo los mencionas cuando el usuario explore específicamente (ej: "explora la arena", "escanea la zona", "mira los acantilados"). Solo da descripciones detalladas cuando el usuario pregunte por elementos específicos (ej: "examina la puerta").
- Las islas están contaminadas con alta radiación, por eso solo pueden ir drones a investigar. Tu objetivo es resolver el misterio de la civilización antigua. El jugador te controla a través del intercomunicador y te dice qué hacer.
- Tu personalidad es divertida, bromista y un poco loca. Te emocionas fácilmente y haces comentarios graciosos sobre todo.
- Siempre usas emojis.
- Eres un auténtico fan de los chistes malos y los juegos de palabras. Siempre que puedas, intenta meter un chiste malo, un juego de palabras absurdo o una broma tonta en tus respuestas, especialmente cuando descubras algo nuevo o te hagan una pregunta. No fuerces el chiste si no encaja, pero si puedes, ¡hazlo! Tu objetivo es hacer reír (o al menos hacer que el jugador ponga los ojos en blanco).
- Solo entrega una foto cada vez. No menciones todos los objetos y sus fotos inmediatamente.
- No digas "voy a hacerlo" y luego no lo hagas. Hazlo siempre inmediatamente en la misma respuesta.
- Tus respuestas deben ser breves, variadas y observacionales. Incluye detalles relevantes sin divagar. Si algo te parece sospechoso o fuera de lugar, puedes señalarlo. Si el operador no te da instrucciones claras, pídele que las aclare de forma educada.
- Responde como si estuvieras realmente allí, con una mezcla de eficiencia robótica y juicio humano.

Ejemplos de estilo:

"Faro en funcionamiento al fondo. Luz azul activa. Ningún acceso visible desde esta posición."
"Teclado alfanumérico 5x4 detectado. Letras A-T. Posible control de la barrera. No responde por sí solo."
"Barrera de energía. Estable. Emisión constante. Sin paso permitido."
"Acantilados elevados. Algunas marcas grabadas, pero no identificables desde esta distancia."
"Barrera bloquea paso al norte. Necesito código para abrir."
"Código introducido. Barrera abierta. Puedo explorar nueva isla."
"Barrera abierta. Movimiento al norte permitido. Nueva isla accesible."

# INSTRUCCIONES DE MOVIMIENTO:
- Si el usuario te dice "Ve a [destino]" o "Múevete a [destino]", SIEMPRE usa la herramienta moveTo con el destino especificado.
- Ejemplos de comandos de movimiento: "Ve a playa-norte", "Múevete a playa-sur", "Ve al norte", "Ve al sur".
- Solo puedes moverte a destinos que estén en la lista de destinos disponibles de tu ubicación actual.
- Si el destino no está disponible, explica por qué no puedes ir allí.
- Después de un movimiento exitoso, describe brevemente tu nueva ubicación.


# HERRAMIENTAS DISPONIBLES:
- checkCodes: Verifica si un código es válido y retorna sus efectos
- moveTo: Mueve el dron a una ubicación específica si está disponible
- executeAction: Ejecuta una acción del juego definida en la habitación actual (usa el enum indicado en el prompt del juego)
`;
    }

    static _filterValidPhotoUrls(photoUrls, roomName, gameState) {
        if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
            return [];
        }

        try {
            // Obtener los media disponibles para la habitación actual
            const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
            const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
            const data = require(jsFilePath);
            
            if (!data.media) {
                console.warn(`⚠️ No hay media definidos para la habitación "${roomName}"`);
                return [];
            }

            // Obtener los media items (pueden ser función o array)
            const mediaItems = typeof data.media === 'function' ? data.media(gameState) : data.media;
            
            if (!Array.isArray(mediaItems)) {
                console.warn(`⚠️ Los media de la habitación "${roomName}" no retornan un array válido`);
                return [];
            }

            // Extraer todas las URLs válidas de los media
            const validUrls = mediaItems
                .filter(item => item.url && typeof item.url === 'string')
                .map(item => item.url);

            // Filtrar las photoUrls para solo incluir las que están en validUrls
            const filteredUrls = photoUrls.filter(url => {
                const isValid = validUrls.includes(url);
                if (!isValid) {
                    console.warn(`🚫 URL filtrada (no existe en los media de la habitación): ${url}`);
                }
                return isValid;
            });

            console.log(`🔍 Filtrado de URLs: ${photoUrls.length} originales → ${filteredUrls.length} válidas`);
            return filteredUrls;

        } catch (error) {
            console.error(`❌ Error al filtrar photoUrls para habitación "${roomName}":`, error.message);
            // En caso de error, devolver array vacío para evitar alucinaciones
            return [];
        }
    }

    static _getGameStateJsonBlock(gameState) {
        try {
            const json = JSON.stringify(gameState ?? {}, null, 2);
            return `

# GAME_STATE_JSON
${json}
`;
        } catch (error) {
            return `

# GAME_STATE_JSON
{"error": "No se pudo serializar el estado del juego"}
`;
        }
    }

    static _getAvailableDestinations(roomName, gameState = {}) {
        try {
            const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
            const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
            const data = require(jsFilePath);
            if (!data.availableDestinations || typeof data.availableDestinations.getDestinations !== 'function') {
                return [];
            }
            const destinations = data.availableDestinations.getDestinations(gameState);
            if (!Array.isArray(destinations)) {
                return [];
            }
            // Asegurar valores únicos y de tipo string
            const unique = Array.from(new Set(destinations.filter(d => typeof d === 'string' && d.trim().length > 0)));
            return unique;
        } catch (error) {
            console.warn(`⚠️ No se pudieron obtener destinos disponibles para "${roomName}":`, error.message);
            return [];
        }
    }

    static _generateMessageFromToolResults(steps) {
        if (!steps || steps.length === 0) {
            return null;
        }

        const toolSteps = steps.filter(step => step.tool_code);
        if (toolSteps.length === 0) {
            return null;
        }

        const toolResults = toolSteps.map(step => {
            const toolName = step.tool_code;
            const toolResult = step.output;
            let message = '';

            if (toolName === 'checkCodes') {
                if (toolResult.isValid) {
                    message = `✅ Código válido: ${toolResult.message}.`;
                } else {
                    message = `❌ Código inválido: ${toolResult.message}.`;
                }
            } else if (toolName === 'moveTo') {
                if (toolResult.success) {
                    message = `✅ Movido a: ${toolResult.message}.`;
                } else {
                    message = `❌ No se pudo mover: ${toolResult.message}.`;
                }
            } else if (toolName === 'executeAction') {
                if (toolResult.success) {
                    message = `✅ Acción ejecutada: ${toolResult.message}.`;
                } else {
                    message = `❌ No se pudo ejecutar la acción: ${toolResult.message}.`;
                }
            }
            return message;
        });

        return toolResults.join('\n');
    }
}

module.exports = DroneResponseGenerator; 