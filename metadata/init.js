const path = require('path');
const fs = require('fs');

const { Client } = require('pg');

async function init(){
    const client = new Client();

    await client.connect();

    const sql = fs.readFileSync( path.resolve(__dirname,'sql/schema.sql'), 'utf-8');
    await client.query(sql);
    await client.end();
}

module.exports = init;
