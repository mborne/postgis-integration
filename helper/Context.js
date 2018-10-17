const Database = require('./Database');
const Metadata = require('./Metadata');
const DatasetDir = require('./DatasetDir');

class Context {
    constructor(){
        this.database = new Database();
        this.metadata = new Metadata(this.database);
    }

    /**
     * @param {DatasetDir} datasetName 
     */
    getDatasetDir(datasetName){
        return new DatasetDir(datasetName);
    }

    /**
     * Return today date 
     */
    today(){
        return new Date().toISOString().slice(0,10);
    }

    async close(){
        await this.database.close();
    }
}

module.exports = Context;
