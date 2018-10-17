const shell = require('shelljs');
const path = require('path');

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
    var targetPath  = path.dirname(archivePath);
    var command = 'unzip -o -d '+targetPath+' '+archivePath;
    console.log(command);
    if (shell.exec(command).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = unzip;




