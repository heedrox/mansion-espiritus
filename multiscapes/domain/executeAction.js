const GameStateService = require('../infrastructure/GameStateService');
const path = require('path');
const PromptGenerator = require('./PromptGenerator');

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
      const recalculatedPrompt = PromptGenerator.getRoomPrompt(currentRoom, updatedGameState);

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
}

module.exports = ExecuteAction;