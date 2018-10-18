const Database = require('./Database');
const Metadata = require('./Metadata');
const DatasetDir = require('./DatasetDir');

/**
 * Provides helper to simplify integration scripts
 */
class Context {
    constructor(){
        this.database = new Database();
        this.metadata = new Metadata(this.database);
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

    /**
     * Release resources (database connection)
     */
    async close(){
        await this.database.close();
    }
}

module.exports = Context;
