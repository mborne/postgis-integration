const shell = require('shelljs');
const path = require('path');

const debug = require('debug')('extract');

/**
 * Extract .7z archives
 */
function extractor7z(archivePath){
    /*
    * check for 7z
    */
    if (!shell.which('7z')) {
        throw '7z is missing to extract '+archivePath;
    }

    var targetPath = path.dirname(archivePath);

    /* Extract zip file */
    var command = '7z x -y '+archivePath+' -o'+targetPath;
    debug(command);
    if (shell.exec(command).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = extractor7z;
