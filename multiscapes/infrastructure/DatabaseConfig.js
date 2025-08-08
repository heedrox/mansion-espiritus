const admin = require('firebase-admin');

class DatabaseConfig {
    static _db = null;
    
    static getDb() {
        if (!this._db) {
            const useEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
            const defaultProjectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || 'demo-twin-islands';

            if (!admin.apps.length) {
                if (useEmulator) {
                    // Initialize without credentials for emulator, but set a projectId
                    process.env.GOOGLE_CLOUD_PROJECT = defaultProjectId;
                    process.env.GCLOUD_PROJECT = defaultProjectId;
                    admin.initializeApp({ projectId: defaultProjectId });
                } else {
                    // Production / non-emulator
                    admin.initializeApp({
                        credential: admin.credential.applicationDefault(),
                        projectId: defaultProjectId
                    });
                }
            }
            
            this._db = admin.firestore();
            
            // Log emulator usage
            if (useEmulator) {
                console.log('🔌 Usando Firestore Emulator en', process.env.FIRESTORE_EMULATOR_HOST, 'proyecto:', defaultProjectId);
            }
        }
        return this._db;
    }
    
    static getCollectionName() {
        return 'twin-islands';
    }
    
    static getDocumentPath(code) {
        const collection = this.getCollectionName();
        return `${collection}/${code}`;
    }

    static getGamesDataDir() {
        // Base path for room prompts and media data
        return require('path').resolve(__dirname, '../../miniscapes/games-data');
    }
}

module.exports = DatabaseConfig; 