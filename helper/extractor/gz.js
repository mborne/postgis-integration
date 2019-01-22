const shell = require('shelljs');
const path = require('path');

const debug = require('debug')('extract');

/**
 * Extract .zip archives
 */
function gz(archivePath){
    /*
    * check for 7z
    */
    if (!shell.which('gunzip')) {
        throw 'gunzip is missing to extract '+archivePath;
    }
    var targetPath  = path.dirname(archivePath)+'/'+path.basename(archivePath,'.gz');
    var command = 'gunzip < '+archivePath+' > '+targetPath;
    debug(command);
    if (shell.exec(command).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = gz;

