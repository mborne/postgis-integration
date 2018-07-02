const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

/* handle script parameters */
var CODE_DEP = process.argv[2];
if ( typeof CODE_DEP === 'undefined' ){
	shell.echo('missing parameter CODE_DEP');
	shell.exit(1);
}

async function main(){ 
    /* Create data directory */
    var datasetDir = new DatasetDir('geosirene/'+CODE_DEP);

    /* Adapt config */
    config.name    = 'geosirene/'+CODE_DEP;
    config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version = new Date().toISOString().slice(0,10);

    /* Change directory to data directory */
    shell.cd(datasetDir.getPath());

    /* Download archive */
    var archive = await download({
        sourceUrl: config.url.replace('{CODE_DEP}',CODE_DEP),
        targetPath: datasetDir.getPath()+'/sirene.7z'
    });
    
    /* Extract archive */
    extract(archive);

    /* Import table */
    ogr2pg({
        inputPath: 'geo-sirene_'+CODE_DEP+'.csv',
        schemaName: 'sirene',
        tableName: 'etablissement'
    });
    
    /* Cleanup and save metadata */
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}

main();
