const Database = require('./Database');
const SourceManager = require('./SourceManager');

/**
 * Provides helper to simplify integration scripts
 */
class Context {

    /**
     * See Context.createContext()
     * @private
     * @param {Database} database
     */
    constructor(database){
        this.database = database;
    }

    /**
     * @return {Context}
     */
    static async createContext(){
        let database = await Database.createDatabase();
        return new Context(database);
    }


    /**
     * Get SourceManager for a given schema
     * @param {string} schemaName
     * @return {SourceManager}
     */
    async getSourceManager(schemaName){
        let sourceManager = await SourceManager.createSourceManager(
            this.database,
            schemaName
        );
        return sourceManager;
    }

    /**
     * Release resources (database connection)
     */
    async close(){
        await this.database.close();
    }

    /**
     * Return today date
     */
    today(){
        return new Date().toISOString().slice(0,10);
    }

}

module.exports = Context;
