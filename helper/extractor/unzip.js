const shell = require('shelljs');

/**
 * Extract .zip archives
 */
function unzip(archivePath){
    /*
    * check for 7z
    */
    if (!shell.which('unzip')) {
        throw 'unzip is missing to extract '+archivePath;
    }
    if (shell.exec('unzip -o '+archivePath).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = unzip;




