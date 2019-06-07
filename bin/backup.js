#!/usr/bin/env node

const Database = require('../helper/Database');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

/**
 * Get available schema names
 * @returns {string[]}
 */
async function availableSchemaNames(){
    let database = await Database.createDatabase();
    let schemaNames = await database.listSchemas();
    await database.close();
    return schemaNames;
}

/**
 * Backup single schema
 * @param {string} targetDir
 * @param {string} schemaName
 */
async function backup(targetDir,schemaName){
    /* backup schema */
    {
        let targetPath = path.resolve(targetDir,`${schemaName}.schema.sql`);
        console.log(`Save ${targetPath} ...`);
        let command = `pg_dump -O -x --schema-only -n ${schemaName} > ${targetPath}`;
        if ( shell.exec(command).code != 0 ){
            throw new Error(`Command fails : ${command}`);
        }
    }

    /* backup data */
    {
        let targetPath = path.resolve(targetDir,`${schemaName}.data.sql`);
        console.log(`Save ${targetPath} ...`);
        let command = `pg_dump -O -x --data-only -n ${schemaName} > ${targetPath}`;
        if ( shell.exec(command).code != 0 ){
            throw new Error(`Command fails : ${command}`);
        }
    }
}

/**
 * Generate per schema backups
 */
async function main(){
    if ( process.argv.length < 3 ){
        throw new Error("Usage : postgis-backup <targetDir> [<schemaName>]");
    }
    let targetDir  = process.argv[2];
    let schemaNameFilter = process.length < 4 ? null : process.argv[3];

    /* handle targetDir */
    targetDir = path.resolve(targetDir);
    if ( ! fs.existsSync(targetDir) ){
        shell.mkdir('-p',targetDir);
    }

    /* handle schemaName */
    let schemaNames = await availableSchemaNames();
    schemaNames = schemaNames.filter(function(schemaName){
        return schemaNameFilter == null || schemaName == schemaNameFilter;
    });
    if ( schemaNames.length == 0 ){
        throw new Error(`schema "${schemaNameFilter}" not found in ${JSON.stringify(schemaNames)}`);
    }
    for ( var i in schemaNames ){
        await backup(targetDir,schemaNames[i]);
    }
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});





