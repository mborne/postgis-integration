const { Pool } = require('pg');

const psql = require('./psql');

/**
 * Helper to query database
 */
class Database {

    constructor() {
        this.pool = new Pool();
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        })
    }

    /**
     * Close pool
     */
    async close(){
        await this.pool.end();    
    }

    /**
     * Execute query
     * @param {string} sql 
     * @param {any[]} values
     * @return {Object[]} 
     */
    async query(sql, values) {
        const client = await this.pool.connect();
        try {
            const res = await client.query(sql, values)
            return res.rows;
        } finally {
            client.release();
        }
    }

    /**
     * Execute SQL file with psql
     * @param {String} sqlPath 
     */
    async batch(sqlPath){
        return psql({
            inputPath: sqlPath
        });
    }


    /**
     * List schemas
     */
    async listSchemas() {
        const sql = `select schema_name from information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'`;
        const rows = await this.query(sql);
        return rows.map(function (row) { return row.schema_name });
    }

    /**
     * List table in a given schema
     * @param {String} schemaName 
     */
    async listTables(schemaName) {
        const sql = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname = $1`;
        const rows = await this.query(sql, [schemaName]);
        return rows.map(function (row) { return row.tablename });
    }

}

module.exports = Database;

