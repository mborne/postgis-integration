const path = require('path');
const fs = require('fs');

const mapping = {
    '.7z': require('./extractor/7z'),
    '.zip': require('./extractor/unzip'),
    '.bz2': require('./extractor/bz2')
};

/**
 * Extracts archive (7z, zip and bz2) in parent directory
 * 
 * Note that it relies on system CLI tools
 * 
 * @param {string} archivePath 
 */
function extract(archivePath){
    if ( ! fs.existsSync(archivePath) ){
        throw new Error("file not found : "+archivePath);
    }

    var ext = path.extname(archivePath);
    if ( ! mapping[ext] ){
        throw 'No extractor found for '+ext;
    }
    mapping[ext](archivePath);
}

module.exports = extract;

