
const shell = require('shelljs');
const path = require('path');

const rootDir = __dirname+'/../data';

/**
 * Create data directory for a given dataset
 * @param {Object} options
 * @param {String} options.datasetName
 * @return {String} path to the directory
 */
var createDataDir = function(options){
    var result = rootDir+'/'+options.datasetName;
    if (shell.exec('mkdir -p '+result).code !== 0) {
        throw new Error('Fail to create data directory : '+result);
    }
    return path.resolve(result);
};

module.exports = createDataDir ;
