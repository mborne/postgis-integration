const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');
const metadata = require('../../metadata');

/* handle script parameters */
var CODE_DEP = process.argv[2];
if ( typeof CODE_DEP === 'undefined' ){
	shell.echo('missing parameter CODE_DEP');
	shell.exit(1);
}

async function main(){
    /* Create data directory */
    var datasetDir = new DatasetDir('ban/'+CODE_DEP);

    /* Change directory to data directory */
    shell.cd(datasetDir.getPath());

    /* adapt config for partition */
    config.name    = 'ban/'+CODE_DEP;
    config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version = new Date().toISOString().slice(0,10);

    /* Download archive */
    await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/ban.zip'
    });

    /* Extract archive */
    extract('ban.zip');

    await ogr2pg({
        inputPath: 'BAN_licence_gratuite_repartage_'+CODE_DEP+'.csv',
        schemaName: 'ban',
        tableName: 'adresse'
    });

    datasetDir.remove();
    await metadata.add(config);
}

main();
