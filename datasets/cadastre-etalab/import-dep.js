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
    var datasetDir = new DatasetDir('cadastre-etalab/'+CODE_DEP);

    /* adapt config for partition */
    config.name    = 'cadastre-etalab/'+CODE_DEP;
    config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version = new Date().toISOString().slice(0,10);

    /* Change directory to data directory */
    shell.cd(datasetDir.getPath());

    /* Download and extract files */
    const layerNames = ["commune","section","feuille","parcelle","batiment"];
    var downloads = layerNames.map(function(layerName){
        var url = config.url
            .replace(/{LAYER}/g,layerName)
        ;
        return download({
            sourceUrl: url,
            targetPath: datasetDir.getPath()+'/'+layerName+'.zip'
        }).then(function(archiveFile){
            extract(archiveFile);
        })
    });
    await Promise.all(downloads);

    /* Import shapefiles... */
    layerNames.forEach(function(layerName){
        ogr2pg({
            inputPath: layerName+'s.shp',
            tableName: layerName,
            schemaName: 'cadastre',
            encoding: 'LATIN1'
        });
    });

    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}

main();





