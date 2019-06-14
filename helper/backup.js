const debug = require('debug')('postgis-helper');

const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const pg_dump = require('./internal/pg_dump');

/**
 * Backup a given schema. Produces :
 *
 * - {targetDir}/{schemaName}.schema.sql
 * - {targetDir}/{schemaName}.data.sql
 *
 * @param {object} options
 * @param {string} options.targetDir
 * @param {string} options.schemaName
 */
async function backup(options){
    options = _.defaults(options,{
        targetDir: null,
        schemaName: null
    });

    /* check parameters */
    if ( options.targetDir == null ){
        throw new Error('targetDir is required');
    }
    if ( ! fs.existsSync(options.targetDir) ){
        throw new Error(`${options.targetDir} not found`);
    }
    if ( options.schemaName == null ){
        throw new Error('schemaName is required');
    }

    /*
     * invoke pg_dump
     */
    debug(`backup ${options.schemaName} to ${options.targetDir}...`);

    /* backup schema */
    {
        let targetPath = path.resolve(options.targetDir,`${options.schemaName}.schema.sql`);
        debug(`Save ${targetPath} ...`);
        await pg_dump({
            targetPath: targetPath,
            schemaOnly: true,
            schemaName: options.schemaName
        })
    }

    /* backup data */
    {
        let targetPath = path.resolve(options.targetDir,`${options.schemaName}.data.sql`);
        debug(`Save ${targetPath} ...`);
        await pg_dump({
            targetPath: targetPath,
            dataOnly: true,
            schemaName: options.schemaName
        })
    }

    return options.targetDir;
}

module.exports = backup;
