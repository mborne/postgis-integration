const shell = require('shelljs');

const _ = require('lodash');

/**
 * Run psql on a given file
 * @param {Object} options
 * @param {String} options.inputPath
 * @param {Boolean} [options.quiet=true]
 * @param {Boolean} [options.singleTransation=true]
 * @return {Promise}
 */
var psql = function(options){
    var options = _.defaults(options,{
        quiet: true,
        singleTransation: true
    });

    return new Promise(function(resolve,reject){
        if (!shell.which('psql')) {
            reject({
                'status': 'error',
                'message': 'psql not found'
            });
        }
        var commandParts = [];
        commandParts.push('psql');
        if ( options.quiet ){
            commandParts.push('--quiet');
        }
        if ( options.singleTransation ){
            commandParts.push('--single-transaction');
        }
        commandParts.push('-f '+options.inputPath);

        var command = commandParts.join(' ');
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

module.exports = psql;

