const fs = require('fs');
const path = require('path');

const shell = require('shelljs');

/**
 * Helper to manipulate local dataset directory
 */
class DatasetDir {

    /**
     * @param {string} datasetName
     */
    constructor(datasetName){
        this.path = path.resolve(__dirname+'/../data/'+datasetName);
        if ( ! fs.existsSync(this.path) ){
            shell.mkdir('-p',this.path);
        }
    }

    /**
     * @param {DatasetDir} datasetName
     * @returns {DatasetDir}
     */
    static async createDirectory(datasetName){
        return new DatasetDir(datasetName);
    }

    /**
     * Get absolute path
     * @return {String}
     */
    getPath(){
        return this.path;
    }

    /**
     * Get all files in directory
     * @return {String[]}
     */
    getFiles(){
        return shell.find(this.path+'/.');
    }

    /**
     * Remove all files in directory
     */
    cleanup(){
        shell.rm('-rf',this.path+'/*');
    }

    /**
     * Remove directory
     */
    remove(){
        shell.rm('-rf',this.path);
    }

}

module.exports = DatasetDir;
