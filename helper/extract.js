const path = require('path');
const fs = require('fs');

const mapping = {
    '.7z': require('./extractor/7z'),
    '.zip': require('./extractor/unzip'),
    '.bz2': require('./extractor/bz2')
};

/**
 * Extracts archive in it's directory
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

