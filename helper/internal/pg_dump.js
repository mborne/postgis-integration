const debug = require('debug')('postgis-helper');

const _ = require('lodash');
const shell = require('shelljs');

/**
 * Invoke pg_dump to backup database
 * @param {object} options
 * @param {string} options.targetPath
 * @param {string} [options.schemaName]
 * @param {boolean} [options.schemaOnly=true]
 * @param {boolean} [options.dataOnly=true]
 */
async function pg_dump(options){
    options = _.defaults(options,{
        targetPath: null,
        schemaName: null,
        schemaOnly: false,
        dataOnly: false
    });

    if ( options.targetPath == null ){
        throw new Error("pg_dump - 'targetPath' options is required");
    }

    let parts = [
        'pg_dump',
        '-O',
        '-x'
    ];
    if ( options.schemaOnly ){
        parts.push('--schema-only');
    }
    if ( options.dataOnly ){
        parts.push('--data-only');
    }
    if ( options.schemaName != null ){
        parts.push(`-n ${options.schemaName}`);
    }
    parts.push(`> ${options.targetPath}`);

    let command = parts.join(' ');
    debug(command);
    if ( shell.exec(command,{silent: true}).code != 0 ){
        throw new Error(`Command fails : ${command}`);
    }
    return options.targetPath;
}

module.exports = pg_dump;

