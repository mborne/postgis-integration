const shell = require('shelljs');
const path = require('path');

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
    var archiveName = path.basename(archivePath);
    if (shell.exec('tar xf '+archivePath+' -C '+targetPath).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = bz2;

