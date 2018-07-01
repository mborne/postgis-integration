const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');

if (!shell.which('unzip')) {
	shell.echo('Sorry, this script requires unzip');
	shell.exit(1);
}

var CODE_DEP = process.argv[2];
if ( typeof CODE_DEP === 'undefined' ){
	shell.echo('missing parameter CODE_DEP');
	shell.exit(1);
}

/* Create data directory */
var datasetDir = new DatasetDir('geosirene/'+CODE_DEP);

/* Adapt config */
config.name    = 'geosirene/'+CODE_DEP;
config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
config.version = new Date().toISOString().slice(0,10);

/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Download archive */
download({
    sourceUrl: config.url.replace('{CODE_DEP}',CODE_DEP),
    targetPath: datasetDir.getPath()+'/sirene.7z'
}).then(function(){
    /* Extract archive */
    if (shell.exec('7z x -y sirene.7z').code !== 0) {
        shell.echo('Error: archive extraction failed');
        shell.exit(1);
    }
    /* Import table */
    return ogr2pg({
        inputPath: 'geo-sirene_'+CODE_DEP+'.csv',
        schemaName: 'sirene',
        tableName: 'etablissement'
    });
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});
