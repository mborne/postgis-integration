const fs = require('fs');
const path = require('path');

class Metadata {

    /**
     * @param {Database} database 
     */
    constructor(database){
        this.database = database;
    }

    async init(){
        const sql = fs.readFileSync(path.resolve(__dirname,'sql/metadata.schema.sql'),'utf-8');
        await this.database.query(sql);
    }

    /**
     * Add loaded dataset
     * @param {Object} dataset 
     */
    async add(dataset){
        await this.remove(dataset.name);

        const sql = `
            INSERT INTO metadata.dataset (
                name,parent_name,description,homepage,url,version
            ) VALUES (
                $1,$2,$3,$4,$5,$6
            ) 
        `;
        
        await this.database.query(sql, [
            dataset.name,
            ( dataset.parent_name ) ? dataset.parent_name : null,
            dataset.description,
            dataset.homepage,
            dataset.url,
            dataset.version
        ]);
    }

    /**
     * Remove dataset by name
     * @param {String} datasetName 
     */
    async remove(datasetName){
        const sql = `DELETE FROM metadata.dataset WHERE name LIKE $1`;
        await this.database.query(sql, [datasetName]);
    }

}

module.exports = Metadata;
