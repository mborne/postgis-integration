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
     */
    constructor(database){
        this.database = database;
        this.metadata = new Metadata(this.database);
    }

    /**
     * @return {Context}
     */
    static async createContext(){
        let database = await Database.createDatabase();
        return new Context(database);
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
