const DatabaseConfig = require('./DatabaseConfig');

class DroneDataService {
    constructor() {
        this.db = DatabaseConfig.getDb();
    }

    static async validateDrone(code, drone) {
        if (!code) {
            throw new Error('Code is required');
        }
        if (!drone) {
            throw new Error('Drone is required');
        }

        const service = new DroneDataService();
        await service._validateDrone(code, drone);
    }

    static async getDroneData(code, drone) {
        if (!code) {
            throw new Error('Code is required');
        }
        if (!drone) {
            throw new Error('Drone is required');
        }

        const service = new DroneDataService();
        return await service._getDroneData(code, drone);
    }

    async _getDroneData(code, drone) {
        try {
            // Construir la ruta del documento usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code, drone);
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
            console.error('Error al obtener datos del drone:', error);
            throw error;
        }
    }

    async _validateDrone(code, drone) {
        try {
            // Construir la ruta del documento usando DatabaseConfig
            const docPath = DatabaseConfig.getDocumentPath(code, drone);
            console.log('Validando drone en:', docPath);
            
            // Verificar que el documento existe
            const docRef = this.db.doc(docPath);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error(`No se encontró el drone en la ruta: ${docPath}`);
            }

            console.log('Drone validado correctamente');
        } catch (error) {
            console.error('Error al validar drone:', error);
            throw error;
        }
    }
}

module.exports = DroneDataService; 