const path = require('path');
const fs = require('fs');

const { Client } = require('pg');

/**
 * Remove dataset(s) by name
 * @param {String} datasetName "adminexpress", "ban%"
 */
async function remove(datasetName){
    const client = new Client();

    await client.connect();

    const sql = `DELETE FROM metadata.dataset WHERE name LIKE $1`;
    
    await client.query(sql, [datasetName]);
    await client.end();
}

module.exports = remove;
