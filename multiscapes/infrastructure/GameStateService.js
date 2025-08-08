const DatabaseConfig = require('./DatabaseConfig');

class GameStateService {
    constructor(code = 'codex') {
        this.db = DatabaseConfig.getDb();
        this.code = code;
    }

    async getBarrierState() {
        try {
            const docRef = this.db.collection('twin-islands').doc(this.code);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const data = doc.data();
                return data.barreraElectromagneticaAbierta || false;
            } else {
                // Si el documento no existe, crear con estado por defecto
                await this.setBarrierState(false);
                return false;
            }
        } catch (error) {
            console.error('Error al obtener estado de la barrera:', error);
            return false; // Por defecto cerrada
        }
    }

    async setBarrierState(isOpen) {
        try {
            const docRef = this.db.collection('twin-islands').doc(this.code);
            await docRef.update({
                barreraElectromagneticaAbierta: isOpen
            });
            console.log(`Barrera electromagnética ${isOpen ? 'abierta' : 'cerrada'}`);
        } catch (error) {
            console.error('Error al establecer estado de la barrera:', error);
            throw error;
        }
    }

    async openBarrier() {
        return await this.setBarrierState(true);
    }

    async closeBarrier() {
        return await this.setBarrierState(false);
    }

    async getGameState() {
        try {
            const docRef = this.db.collection('twin-islands').doc(this.code);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const data = doc.data() || {};
                return {
                    ...data,
                    barreraElectromagneticaAbierta: data.barreraElectromagneticaAbierta ?? false,
                    start: data.start ?? "1",
                    currentRoom: data.currentRoom ?? 'playa-sur'
                };
            } else {
                // Estado por defecto
                return {
                    barreraElectromagneticaAbierta: false,
                    start: "1",
                    currentRoom: 'playa-sur'
                };
            }
        } catch (error) {
            console.error('Error al obtener estado del juego:', error);
            return {
                barreraElectromagneticaAbierta: false,
                start: "1",
                currentRoom: 'playa-sur'
            };
        }
    }

    async applyStateChanges(stateChanges) {
        try {
            if (!stateChanges || typeof stateChanges !== 'object') {
                console.log('No hay cambios de estado para aplicar');
                return;
            }

            const docRef = this.db.collection('twin-islands').doc(this.code);
            await docRef.update(stateChanges);
            
            console.log(`🔄 Cambios de estado aplicados:`, stateChanges);
        } catch (error) {
            console.error('Error al aplicar cambios de estado:', error);
            throw error;
        }
    }
}

module.exports = GameStateService; 