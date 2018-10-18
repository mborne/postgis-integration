const shell = require('shelljs');
const path = require('path');

const debug = require('debug')('extract');

/**
 * Extract .zip archives
 */
function bz2(archivePath){
    /*
    * check for 7z
    */
    if (!shell.which('tar')) {
        throw 'tar is missing to extract '+archivePath;
    }
    var targetPath  = path.dirname(archivePath);
    var command = 'tar xf '+archivePath+' -C '+targetPath;
    debug(command);
    if (shell.exec(command).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = bz2;

