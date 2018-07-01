const shell = require('shelljs');

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

    /* Extract zip file */
    if (shell.exec('7z x -y '+archivePath).code !== 0) {
        throw 'Fail to extract '+archivePath;
    }
}

module.exports = extractor7z;
