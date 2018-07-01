const shell = require('shelljs');

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
    if (shell.exec('tar xf '+archivePath).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = bz2;

