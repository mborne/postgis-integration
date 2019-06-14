const debug = require('debug')('data-dir');

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const getEnv = require('./internal/getEnv');
const DATA_DIR = getEnv('DATA_DIR',path.resolve(__dirname+'/../data/'));

/**
 * Helper to manipulate subdirectories in a local DATA_DIR
 */
class DataDir {

    /**
     * @private
     * @param {string} datasetName
     */
    constructor(datasetName){
        this.path = path.resolve(DATA_DIR,datasetName);
        debug(`Create DataDir at ${this.path}...`);
        if ( ! fs.existsSync(this.path) ){
            shell.mkdir('-p',this.path);
        }
    }

    /**
     * @param {DataDir} datasetName
     * @returns {DataDir}
     */
    static async createDataDir(datasetName){
        return new DataDir(datasetName);
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

module.exports = DataDir;
