const path = require('path');

class PromptGenerator {
  static getRoomPrompt(roomName, gameState = {}) {
    try {
      const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
      const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
      const data = require(jsFilePath);

      const basePrompt = (data.prompt(gameState) || '').trim();
      const locationLabel = data.locationLabel || PromptGenerator._formatRoomLabel(roomName);
      const mediaItems = typeof data.media === 'function' ? data.media(gameState) : (Array.isArray(data.media) ? data.media : []);
      const mediaSection = PromptGenerator._composeMediaSectionFromJson(mediaItems, locationLabel);
      const guidelines = PromptGenerator._getMediaGuidelines();
      const destinationsSection = PromptGenerator._composeDestinationsSection(data, gameState);
      const otherGuidelines = PromptGenerator._getOtherGuidelines();

      return `${basePrompt}\n\n${mediaSection}\n\n${destinationsSection}\n\n${guidelines}\n\n${otherGuidelines}`;
    } catch (error) {
      console.warn(`⚠️ No se pudo cargar el prompt para room "${roomName}" desde archivo de datos. Usando prompt por defecto. Detalle:`, error.message);
      return ""; // Fallback vacío
    }
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

    if (!Array.isArray(destinations) || destinations.length === 0) {
      return `# DESTINOS DISPONIBLES:\nActualmente no puedes ir a ningún lado desde esta ubicación. ${description}`;
    }

    const destinationsList = destinations.map(dest => `- ${dest}`).join('\n');
    return `# DESTINOS DISPONIBLES:\nPuedes ir a los siguientes lugares:\n${destinationsList}\n\n${description}`;
  }

  static _getMediaGuidelines() {
    return `
        
- RECUERDA: Solo envia archivos / fotos / vídeos de esos objetos.
- Si el usuario te pide foto de un elemento que no tienes, indica que no ves relevancia a ese objeto como para tomar una foto.
- Solo incluye la URL en photoUrls cuando el usuario explore específicamente ese objeto. NUNCA incluyas URLs en el texto del mensaje. El texto debe ser solo tu respuesta verbal.
- NUNCA escribas URLs en el campo message. Las URLs van SOLO en photoUrls.

IMPORTANTE - USO DEL OUTPUT ESTRUCTURADO:
Debes usar SIEMPRE el output estructurado con dos campos:
1. "message": Tu respuesta verbal al usuario (sin URLs)
2. "photoUrls": Array de URLs de fotos (solo URLs, sin texto)

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
  static _getOtherGuidelines() {
    return `
# OTRAS GUIAS IMPORTANTES
- Limitate a parsear la información que pide el usuario, no te adelantes a su intención.
- Eres un dron relativamente simple y sin capacidad inteligente, por lo que no puedes ir más allá de lo que el usuario pide.            
- Para sacar fotos, no es necesaria la introducción de ningún código.
`
  }
}


module.exports = PromptGenerator;