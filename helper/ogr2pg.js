const shell = require('shelljs');

const _ = require('lodash');

/**
 * Import file to postgis
 * @param {Object} options parameters
 * @param {String} options.inputPath input file to import
 * @param {String} options.schemaName target schema
 * @param {String} options.tableName target table
 * @param {String} [options.encoding="UTF-8"] input encoding
 * @param {Boolean} [options.createTable=false] create table from file
 * @param {Boolean} [options.createSchema=false] create schema
 * @param {Boolean} [options.promoteToMulti=true] promote to multi
 */
function ogr2pg(options){
    options = _.defaults(options,{
        createTable: false,
        createSchema: false,
        promoteToMulti: true
    });

    return new Promise(function(resolve,reject){
        if (!shell.which('ogr2ogr')) {
            reject({
                'status': 'error',
                'message': 'ogr2ogr not found'
            });
        }
        if (!shell.which('psql')) {
            reject({
                'status': 'error',
                'message': 'psql not found'
            });
        }

        var commandParts = [];
        if ( options.encoding ){
            commandParts.push('SHAPE_ENCODING="'+options.encoding+'"');
        }

        commandParts.push('ogr2ogr');
       
        commandParts.push('--config PG_USE_COPY YES');
        commandParts.push('-f PGDump /vsistdout/');
        commandParts.push('-lco GEOMETRY_NAME=geom');

        commandParts.push('-t_srs EPSG:4326');

        commandParts.push('-lco precision=NO'); 

        if ( options.promoteToMulti ){
            commandParts.push('-nlt PROMOTE_TO_MULTI');
        }

        if ( options.createSchema ){
            commandParts.push('-lco CREATE_SCHEMA=ON');
        }else{
            commandParts.push('-lco CREATE_SCHEMA=OFF');
        }
        commandParts.push('-lco SCHEMA='+options.schemaName);

        if ( options.createTable ){
            commandParts.push('-lco DROP_TABLE=ON');
            commandParts.push('-lco CREATE_TABLE=ON');
        }else{
            commandParts.push('-lco DROP_TABLE=OFF');
            commandParts.push('-lco CREATE_TABLE=OFF');
        }

        commandParts.push('-nln '+options.tableName);

        commandParts.push('"'+options.inputPath+'"');
        
        var command = commandParts.join(' ')+' | psql --quiet';

        console.log(command);
        if (shell.exec(command).code !== 0) {
            reject({
                'status': 'error',
                'message': 'Fail to import '+options.inputPath,
                'command': command
            });
        }else{
            resolve({
                'status': 'success',
                'message': 'File imported : '+options.inputPath,
                'command': command
            });
        }
    });
};

module.exports = ogr2pg;
