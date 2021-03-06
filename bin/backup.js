#!/usr/bin/env node

const {Database,backup} = require('@mborne/postgis-helper');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

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
    let database = await Database.createDatabase();
    let schemaNames = await database.getSchemaNames();
    /* filter according to parameters */
    schemaNames = schemaNames.filter(function(schemaName){
        return schemaNameFilter == null || schemaName == schemaNameFilter;
    });
    if ( schemaNames.length == 0 ){
        throw new Error(`schema "${schemaNameFilter}" not found in ${JSON.stringify(schemaNames)}`);
    }
    for ( var i in schemaNames ){
        await backup({
            targetDir: targetDir,
            schemaName: schemaNames[i]
        });
    }
    await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});





