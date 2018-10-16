const { Client } = require('pg');

/**
 * Add dataset
 * @param {Object} dataset 
 */
async function add(dataset){
    const client = new Client();

    await client.connect();

    const sql = `
        INSERT INTO metadata.dataset (
            name,description,homepage,url,version
        ) VALUES (
            $1,$2,$3,$4,$5
        ) 
    `;
    
    await client.query(sql, [
        dataset.name,
        dataset.description,
        dataset.homepage,
        dataset.url,
        dataset.version
    ]);
    await client.end();
}

module.exports = add;
