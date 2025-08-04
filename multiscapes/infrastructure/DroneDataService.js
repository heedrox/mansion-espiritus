const DatabaseConfig = require('./DatabaseConfig');

class DroneDataService {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    static async validateGame(code) {
        if (!code) {
            throw new Error('Code is required');
        }

        const service = new DroneDataService();
        await service._validateGame(code);
    }

    static async getGameData(code) {
        if (!code) {
            throw new Error('Code is required');
        }

        const service = new DroneDataService();
        return await service._getGameData(code);
    }

    async _getGameData(code) {
        try {
            // Construir la ruta del documento usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code);
            console.log('Buscando documento en:', docPath);
            
            // Recuperar el documento de Firestore
            const docRef = this.db.doc(docPath);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error(`No se encontró el documento en la ruta: ${docPath}`);
            }

            const data = doc.data();
            console.log('Datos del documento:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener datos del juego:', error);
            throw error;
        }
    }

    async _validateGame(code) {
        try {
            // Construir la ruta del documento usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code);
            console.log('Validando juego en:', docPath);
            
            // Verificar que el documento existe
            const docRef = this.db.doc(docPath);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error(`No se encontró el juego en la ruta: ${docPath}`);
            }

            console.log('Juego validado correctamente');
        } catch (error) {
            console.error('Error al validar juego:', error);
            throw error;
        }
    }
}

module.exports = DroneDataService; 