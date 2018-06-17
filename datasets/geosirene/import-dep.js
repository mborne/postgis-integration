const shell = require('shelljs');

const createDataDir = require('../../helper/createDataDir');
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
var dataDir = createDataDir({
    datasetName: 'sirene-'+CODE_DEP
});

/* Change directory to data directory */
shell.cd(dataDir);

/* Download archive */
download({
    sourceUrl: config.url.replace('{CODE_DEP}',CODE_DEP),
    targetPath: dataDir+'/sirene.7z'
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
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});
