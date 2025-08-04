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
    
    static getCollectionName() {
        return 'twin-islands';
    }
    
    static getDocumentPath(code) {
        const collectionName = this.getCollectionName();
        return `${collectionName}/${code}`;
    }
}

module.exports = DatabaseConfig; 