const admin = require('firebase-admin');

class DatabaseConfig {
    static _db = null;
    
    static getDb() {
        if (!this._db) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    projectId: 'mansion-espiritus-lkgoxs'
                });
            }
            
            this._db = admin.firestore();
            
            // Configurar base de datos según entorno (solo una vez)
            if (process.env.NODE_ENV === 'production') {
                this._db.settings({ databaseId: 'miniscapes' });
            } else {
                // En desarrollo, usar base de datos específica
                this._db.settings({ databaseId: 'miniscapes' });
            }
        }
        
        return this._db;
    }
    
    static getCollectionName(code) {
        return `twin-islands-${code}`;
    }
    
    static getDocumentPath(code, drone) {
        const collectionName = this.getCollectionName(code);
        return `${collectionName}/${drone}`;
    }
}

module.exports = DatabaseConfig; 