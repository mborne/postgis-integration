const fs = require('fs');
const path = require('path');

const shell = require('shelljs');

/**
 * Helper to manipulate local dataset directory
 */
class DatasetDir {
    constructor(datasetName){
        this.path = path.resolve(__dirname+'/../data/'+datasetName);
        if ( ! fs.existsSync(this.path) ){
            shell.mkdir('-p',this.path);
        }
    }

    getPath(){
        return this.path;
    }

    cleanup(){
        shell.rm('-rf',this.path+'/*');
    }

    remove(){
        shell.rm('-rf',this.path);
    }

}

module.exports = DatasetDir;
