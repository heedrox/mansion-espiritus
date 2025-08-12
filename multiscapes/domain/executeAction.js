const GameStateService = require('../infrastructure/GameStateService');
const path = require('path');

class ExecuteAction {
  static async executeAction(actionKey, code) {
    try {
      const gameStateService = new GameStateService(code);
      const currentGameState = await gameStateService.getGameState();
      const currentRoom = currentGameState.currentRoom || 'playa-sur';

      // Cargar datos de la habitación actual
      const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
      const jsFilePath = path.join(gamesDataDir, `${currentRoom}.js`);
      const roomData = require(jsFilePath);

      if (!roomData.actions || typeof roomData.actions !== 'object') {
        return {
          success: false,
          message: `No hay acciones definidas para esta ubicación (${currentRoom}).`,
          reason: 'no_actions_defined'
        };
      }

      const action = roomData.actions[actionKey];
      if (!action) {
        return {
          success: false,
          message: `La acción "${actionKey}" no es válida en esta ubicación (${currentRoom}).`,
          reason: 'invalid_action'
        };
      }

      const stateChanges = action.gameStateUpdate || action.stateChanges || {};
      if (typeof stateChanges !== 'object' || Array.isArray(stateChanges)) {
        return {
          success: false,
          message: `La acción "${actionKey}" no tiene un objeto válido de actualización de estado.`,
          reason: 'invalid_state_changes'
        };
      }

      // Aplicar cambios de estado
      await gameStateService.applyStateChanges(stateChanges);

      // Obtener estado actualizado y recalcular prompt
      const updatedGameState = await gameStateService.getGameState();
      const recalculatedPrompt = ExecuteAction._getRoomPrompt(currentRoom, updatedGameState);

      return {
        success: true,
        message: action.successMessage || `Acción "${actionKey}" ejecutada correctamente.`,
        action: actionKey,
        updatedGameState,
        prompt: recalculatedPrompt
      };
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
      return {
        success: false,
        message: `Hubo un error al ejecutar la acción "${actionKey}".`,
        reason: 'error'
      };
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

  static _getRoomPrompt(roomName, gameState = {}) {
    try {
      const gamesDataDir = path.resolve(__dirname, '../../multiscapes/games-data');
      const jsFilePath = path.join(gamesDataDir, `${roomName}.js`);
      const data = require(jsFilePath);

      const basePrompt = (data.prompt(gameState) || '').trim();
      const locationLabel = data.locationLabel || ExecuteAction._formatRoomLabel(roomName);
      const mediaSection = ExecuteAction._composeMediaSectionFromJson(Array.isArray(data.media) ? data.media : [], locationLabel);
      const guidelines = ExecuteAction._getMediaGuidelines();
      const destinationsSection = ExecuteAction._composeDestinationsSection(data, gameState);

      return `${basePrompt}\n\n${mediaSection}\n\n${destinationsSection}\n\n${guidelines}`;
    } catch (error) {
      console.warn(`⚠️ No se pudo recalcular el prompt para room "${roomName}". Detalle:`, error.message);
      return '';
    }
  }
}

module.exports = ExecuteAction;