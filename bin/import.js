#!/usr/bin/env node

const shell = require('shelljs');

const datasets = require('../datasets');
const datasetNames = Object.keys(datasets);

/* Get and check datasetName to import */
const datasetName = process.argv[2];
if ( typeof datasetName === 'undefined' || datasetNames.indexOf(datasetName) === -1 ){
    shell.echo('Usage : pgi-import ('+datasetNames.join('|')+')');
    shell.exit(1);
}

/* Import dataset */
var scriptPath = __dirname+'/../datasets/'+datasetName+'/import.js';
var command = "node "+scriptPath;
if (shell.exec(command).code !== 0) {
    console.log('Error: fail to import dataset '+datasetName);
    shell.exit(1);
}else{
    shell.exit(0);
}
