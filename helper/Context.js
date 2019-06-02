const Database = require('./Database');
const Metadata = require('./Metadata');
const DatasetDir = require('./DatasetDir');

/**
 * Provides helper to simplify integration scripts
 */
class Context {

    /**
     * See Context.createContext()
     * @private
     * @param {Database} database
     * @param {Metadata} metadata
     */
    constructor(database,metadata){
        this.database = database;
        this.metadata = metadata;
    }

    /**
     * @return {Context}
     */
    static async createContext(){
        let database = await Database.createDatabase();
        let metadata = new Metadata(database);
        await metadata.init();
        return new Context(database,metadata);
    }

    /**
     * Release resources (database connection)
     */
    async close(){
        await this.database.close();
    }

    /**
     * @param {DatasetDir} datasetName
     */
    createDirectory(datasetName){
        return new DatasetDir(datasetName);
    }

    /**
     * Return today date
     */
    today(){
        return new Date().toISOString().slice(0,10);
    }

}

module.exports = Context;
