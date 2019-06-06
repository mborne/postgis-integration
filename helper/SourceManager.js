const debug = require('debug')('postgis-helper');

const Database = require('./Database');

/**
 * Allows to store sources to meet some license requirement
 */
class SourceManager {

    /**
     * @private
     * @param {Database} database
     */
    constructor(database,schemaName){
        if ( typeof schemaName === 'undefined' ){
            throw new Error("schemaName is undefined");
        }
        this.database   = database;
        this.schemaName = schemaName;
    }

    /**
     * SourceManager factory
     * @param {Database} database
     * @param {string} schemaName target schema
     */
    static async createSourceManager(database,schemaName){
        let sourceManager = new SourceManager(database,schemaName);
        await sourceManager.initSchema();
        return sourceManager;
    }

    /**
     * Ensure that ${schemaName}.source table exists
     * @private
     */
    async initSchema(){
        debug(`Ensure ${this.schemaName}.source table exists...`);
        const sql = `
CREATE TABLE IF NOT EXISTS ${this.schemaName}.source
(
    name text primary key,
    description text,
    homepage text,
    url text,
    version text
);
        `;
        await this.database.query(sql);
    }

    /**
     * Add loaded source
     * @param {Object} source
     */
    async add(source){
        debug(`${this.schemaName}.source - update ${source.name}...`);
        await this.remove(source.name);

        const sql = `
            INSERT INTO ${this.schemaName}.source (
                name,description,homepage,url,version
            ) VALUES (
                $1,$2,$3,$4,$5
            )
        `;

        await this.database.query(sql, [
            source.name,
            source.description,
            source.homepage,
            source.url,
            source.version
        ]);
    }

    /**
     * Remove source(s) by name
     * @param {String} sourceName
     */
    async remove(sourceName){
        debug(`${this.schemaName}.source - remove ${sourceName}...`);
        const sql = `DELETE FROM ${this.schemaName}.source WHERE name LIKE $1`;
        await this.database.query(sql, [sourceName]);
    }

}

module.exports = SourceManager;
