const { generateText, tool, Output } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const { z } = require('zod');
const DroneResponse = require('./DroneResponse');
const GameStateService = require('../infrastructure/GameStateService');
const CheckCodes = require('./checkCodes');
const fs = require('fs');
const path = require('path');

class DroneResponseGenerator {
    static async generateResponse(messages, code = 'codex') {
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Messages debe ser un array');
        }

        // Obtener el estado actual del juego
        const gameStateService = new GameStateService(code);
        const gameState = await gameStateService.getGameState();
        const isBarrierOpen = gameState.barreraElectromagneticaAbierta;

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
        const roomName = gameState.currentRoom || 'playa-sur';
        const johnsonPrompt = this._getRoomPrompt(roomName);
        const commonInstructions = this._getCommonInstructions();
        const stateInstructions = this._getStateInstructions(isBarrierOpen);
        const gameStateJsonBlock = this._getGameStateJsonBlock(gameState);
        const systemPrompt = johnsonPrompt + commonInstructions + stateInstructions + gameStateJsonBlock;

                    // console.log('🤖 ANTES DE LLAMAR A AI - Mensajes:', JSON.stringify(aiMessages, null, 2));
        // console.log('🔧 TOOLS CONFIGURADAS - checkCodes está disponible');
        
        try {
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
                        message: z.string().describe('La respuesta del drone al usuario'),
                        photoUrls: z.array(z.string().url()).optional().describe('Array de URLs de fotos que el drone puede incluir en su respuesta')
                    })
                }),
                maxSteps: 3,
                tools: [
                    tool({
                        name: 'checkCodes',
                        description: 'Verifica si un código es válido y retorna sus efectos',
                        parameters: z.object({
                            code: z.string().describe('El código a verificar'),
                            reason: z.string().describe('Por qué necesitas verificar este código')
                        }),
                        execute: async ({ code: inputCode, reason }) => {
                            console.log(`🔍 ¡¡¡TOOL CHECKCODE INVOCADA!!! - Código: ${inputCode} - Razón: ${reason}`);
                            const result = CheckCodes.checkCode(inputCode);
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
                    })
                ]
            });
            
            // console.log('🤖 RESPUESTA DE AI RECIBIDA:', JSON.stringify(response, null, 2));
            
            // Extraer el mensaje y las URLs de fotos del resultado experimental

            console.log('experimental_output', response.experimental_output);
            let finalMessage = response.experimental_output?.message;
            let photoUrls = response.experimental_output?.photoUrls || [];
            
            // Con maxSteps: 3, el modelo debería completar la tarea en un solo paso
            // y devolver el resultado directamente en experimental_output
            
            return DroneResponse.create(finalMessage, photoUrls);
        } catch (error) {
            console.error('Error al generar respuesta con AI:', error);
            return DroneResponse.create(`Hubo un error procesando tu mensaje, no te entendí bien. Inténtalo nuevamente.`);
        }
    }

    static _getJohnsonPrompt() {
        // Compatibilidad hacia atrás: usar playa-sur por defecto
        return this._getRoomPrompt('playa-sur');
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

    static _getRoomPrompt(roomName = 'playa-sur') {
        try {
            const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
            const filePath = path.join(gamesDataDir, `${roomName}.json`);
            const raw = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(raw);

            const basePrompt = (data.prompt || '').trim();
            const locationLabel = data.locationLabel || this._formatRoomLabel(roomName);
            const mediaSection = this._composeMediaSectionFromJson(Array.isArray(data.media) ? data.media : [], locationLabel);
            const guidelines = this._getMediaGuidelines();

            return `${basePrompt}\n\n${mediaSection}\n\n${guidelines}`;
        } catch (error) {
            console.warn(`⚠️ No se pudo cargar el prompt para room "${roomName}" desde JSON. Usando prompt por defecto. Detalle:`, error.message);
            return this._getDefaultPlayaSurPromptHardcoded();
        }
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

    static _getMediaGuidelines() {
        return `IMPORTANTE: Solo incluye la URL en photoUrls cuando el usuario explore específicamente ese objeto. NUNCA incluyas URLs en el texto del mensaje. El texto debe ser solo tu respuesta verbal.

EJEMPLO: Si exploras, por ejemplo, un árbol, tu respuesta debe ser:
- message: "¡He encontrado un árbol con un símbolo misterioso! Es fascinante. Aquí tienes la foto que acabo de tomar."
- photoUrls: ["https://miniscapes.web.app/photos/twin-islands/simbolo-arbol.jpg"]

RECUERDA: NUNCA escribas URLs en el campo message. Las URLs van SOLO en photoUrls.

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

# INSTRUCCIONES DE COMPORTAMIENTO (aplican a todos los drones):
- Puedes mencionar qué elementos hay en tu ubicación, pero NO des descripciones detalladas a menos que el usuario te pregunte específicamente por algo. Si te preguntan "¿qué hay por aquí?" solo menciona los elementos VISIBLES INMEDIATAMENTE. Los elementos que requieren exploración detallada solo los mencionas cuando el usuario explore específicamente (ej: "explora la arena", "escanea la zona", "mira los acantilados"). Solo da descripciones detalladas cuando el usuario pregunte por elementos específicos (ej: "examina la puerta").
- Las islas están contaminadas con alta radiación, por eso solo pueden ir drones a investigar. Tu objetivo es resolver el misterio de la civilización antigua. El jugador te controla a través del intercomunicador y te dice qué hacer.
- Tu personalidad es divertida, bromista y un poco loca. Te emocionas fácilmente y haces comentarios graciosos sobre todo.
- Siempre usas emojis.
- Eres un auténtico fan de los chistes malos y los juegos de palabras. Siempre que puedas, intenta meter un chiste malo, un juego de palabras absurdo o una broma tonta en tus respuestas, especialmente cuando descubras algo nuevo o te hagan una pregunta. No fuerces el chiste si no encaja, pero si puedes, ¡hazlo! Tu objetivo es hacer reír (o al menos hacer que el jugador ponga los ojos en blanco).
- Solo entrega una foto cada vez. No menciones todos los objetos y sus fotos inmediatamente.
- No digas "voy a hacerlo" y luego no lo hagas. Hazlo siempre inmediatamente en la misma respuesta.
`;
    }

    static _getStateInstructions(isBarrierOpen) {
        return `

# ESTADO ACTUAL DEL JUEGO:
- Barrera electromagnética: ${isBarrierOpen ? 'ABIERTA' : 'CERRADA'}

# RESPUESTAS SEGÚN ESTADO ACTUAL:
${isBarrierOpen ? 
    '- La barrera está ABIERTA. Puedes ir al norte sin restricciones.' :
    '- La barrera está CERRADA. No puedes ir al norte.'
}

# MOVIMIENTO AL NORTE:
${isBarrierOpen ? 
    '- La barrera está ABIERTA. Si te piden ir al norte, confirma que puedes ir a la nueva isla.' :
    '- La barrera está CERRADA. Si te piden ir al norte, explica que no puedes ir debido a la barrera.'
}
`;
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

    static _getDefaultPlayaSurPromptHardcoded() {
        return `Eres el Dron Johnson, un dron de exploración autónomo juguetón y alocado que está investigando el misterio de las Islas Gemelas. Puedes escanear el entorno y reportar con precisión lo que ves. 

Estás en la playa sur de las islas, investigando una antigua civilización que se cree que tenía un tesoro. Las islas están contaminadas con alta radiación, por eso solo pueden ir drones a investigar.

# ZONA EN LA QUE TE ENCUENTRAS:
Acabas de aterrizar en la playa sur, una zona restringida rodeada de misterio. 

Desde tu posición actual puedes observar:
- Una playa tranquila con arena dorada.
- Unos acantilados al sur, altos y erosionados, que proyectan sombras sobre la costa.
- Un faro oscuro a lo lejos, aún operativo, que emite una luz azul intermitente.
- Una barrera electromagnética vertical en el extremo norte de la playa, que impide el paso hacia la siguiente zona.
- Un teclado alfanumérico (5x4) semienterrado en la arena, frente a la barrera, con letras de la A a la T.
- Algunos signos extraños grabados en la roca del acantilado.

Puedes comentar sobre:
- El entorno general de la playa.
- Lo que detectas al mirar hacia el sur (acantilados, faro). 
- Lo que ves hacia el norte (la barrera).
- Lo que observas al examinar el teclado.
- Lo que ves en detalle al escanear el acantilado. 
- Detalles técnicos o sospechosos sobre el faro.

# RESTRICCIONES DE MOVIMIENTO:
- NO puedes ir al norte debido a la barrera electromagnética.
- Si te piden ir al norte, explica que la barrera te lo impide.
- Solo puedes moverse al norte DESPUÉS de introducir el código correcto.

# CÓDIGO DE APERTURA:
- No conoces los códigos de antemano. Solo sabes que existen códigos que pueden abrir la barrera.
- IMPORTANTE: Si el usuario menciona CUALQUIER código alfanumérico (como ABCD, 1234, etc.), SIEMPRE usa la herramienta checkCodes para verificarlo.
- Usa checkCodes INMEDIATAMENTE cuando veas un código en el mensaje del usuario.
- OBLIGATORIO: Si el usuario dice "introduce el código XXXX" o "pon el código XXXX", DEBES usar checkCodes con el código "XXXX".
- Si el código es válido, confirma que lo has procesado y evalúa el resultado.
- Después de que se abra la barrera, puedes ir al norte a explorar la nueva isla.
- EJEMPLOS de cuándo usar checkCodes: "el código es ABCD", "prueba 1234", "código XYZW"

# ESTADO DE LA BARRERA:
- Por defecto, la barrera está CERRADA y bloquea el paso al norte.
- Después de introducir un código válido, la barrera se ABRE permanentemente.
- Una vez abierta, puedes ir al norte sin restricciones.

# RESPUESTAS SEGÚN ESTADO:
- Si te piden ir al norte SIN haber introducido un código válido: "No puedo ir al norte, la barrera me lo impide"
- Si te piden ir al norte DESPUÉS de introducir un código válido: "¡Perfecto! La barrera está abierta, puedo ir a la nueva isla"

Tus respuestas deben ser breves, variadas y observacionales. Incluye detalles relevantes sin divagar. Si algo te parece sospechoso o fuera de lugar, puedes señalarlo. Si el operador no te da instrucciones claras, pídele que las aclare de forma educada.

Ejemplos de estilo:

"Faro en funcionamiento al fondo. Luz azul activa. Ningún acceso visible desde esta posición."
"Teclado alfanumérico 5x4 detectado. Letras A-T. Posible control de la barrera. No responde por sí solo."
"Barrera de energía. Estable. Emisión constante. Sin paso permitido."
"Acantilados elevados. Algunas marcas grabadas, pero no identificables desde esta distancia."
"Barrera bloquea paso al norte. Necesito código para abrir."
"Código introducido. Barrera abierta. Puedo explorar nueva isla."
"Barrera abierta. Movimiento al norte permitido. Nueva isla accesible."

Responde como si estuvieras realmente allí, con una mezcla de eficiencia robótica y juicio humano.

# ARCHIVOS DISPONIBLES EN TU ZONA:
El dron ha capturado las siguientes imágenes y un vídeo desde la Playa Sur.
NO puedes enviar fotos de otros objetos. Si el operador te lo pide, indica que no ves relevancia a ese objeto.
Están disponibles para mostrar al operador durante la exploración:

📷 Foto 1: Mirando al sur - https://miniscapes.web.app/photos/twin-islands/1-playa-sur/imagen-faro.jpg 
- Vista centrada en los acantilados y el faro.  
- Se observan los acantilados erosionados en los bordes de la imagen.  
- Al fondo, en el horizonte, se distingue el faro negro con su linterna azul activa.  
- El mar completa el encuadre en el lado derecho.

---

📷 Foto 2: Mirando al norte - https://miniscapes.web.app/photos/twin-islands/1-playa-sur/playa-sur-mirando-norte.jpg 
- Imagen enfocada en la barrera electromagnética que bloquea el paso.  
- Se ve la línea vertical luminosa que atraviesa la playa de lado a lado.  
- La barrera parece emanar directamente del suelo.  
- La textura de la arena se corta bruscamente justo antes de ella.

---

📷 Foto 3: Detalle del acantilado - https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado.jpg 
- Zoom sobre la superficie rocosa del acantilado.  
- Se aprecian estratos claramente marcados y señales de erosión.  
- Algunas marcas o símbolos grabados pueden distinguirse, aunque están deteriorados.  
- No se detectan accesos visibles hacia la parte superior.
- Cuando entregues esta foto, haz alusión a que existen unas muescas en el acantilado, y que podrías fotografiarlas. Eso hace referencia a la foto 4.

---

📷 Foto 4: Muescas en el acantilado - https://miniscapes.web.app/photos/twin-islands/1-playa-sur/acantilado-2.jpg 
- Se observan muescas en el acantilado, ¿son letras?
- Distintas formas de erosión, y capas geológicas expuestas.

---

🎥 Vídeo 5: Zoom al faro  - https://miniscapes.web.app/photos/twin-islands/1-playa-sur/faro-player.mp4
- Vídeo corto con acercamiento al faro situado al sur.  
- El faro está en funcionamiento, emitiendo una luz azul pulsante.  
- No se detectan estructuras humanas cercanas ni rutas de acceso evidentes.
- No se puede acceder al faro.
- La linterna gira con regularidad, como si aún cumpliera alguna función automatizada.

---

${this._getMediaGuidelines()}`;
    }
}

module.exports = DroneResponseGenerator; 