const shell = require('shelljs');

const createDataDir = require('../../helper/createDataDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const psql = require('../../helper/psql');

const config = require('./config.json');

if (!shell.which('gunzip')) {
	shell.echo('Sorry, this script requires unzip');
	shell.exit(1);
}

var CODE_DEP = process.argv[2];
if ( typeof CODE_DEP === 'undefined' ){
	shell.echo('missing parameter CODE_DEP');
	shell.exit(1);
}

const layerNames = ["commune","section","feuille","parcelle","batiment"];

/* Create data directory */
var dataDir = createDataDir({
    datasetName: 'cadastre-etalab/'+CODE_DEP
});

/* Change directory to data directory */
shell.cd(dataDir);

/* Download files */
var downloads = layerNames.map(function(layerName){
    var url = config.url
        .replace(/{CODE_DEP}/g, CODE_DEP)
        .replace(/{LAYER}/g,layerName)
    ;
    return download({
        sourceUrl: url,
        targetPath: dataDir+'/'+layerName+'.zip'
    }).then(function(archiveFile){
        console.log("Extract "+archiveFile+"...");
        if (shell.exec('unzip -o '+archiveFile).code !== 0) {
            shell.echo('Error: unzip failed');
            shell.exit(1);
        }
    });
});
Promise.all(downloads).then(function(){
    /* Import shapefiles... */
    var imports = layerNames.map(function(layerName){
        return ogr2pg({
            inputPath: layerName+'s.shp',
            tableName: layerName,
            schemaName: 'cadastre'
        });
    });
    return Promise.all(imports);
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});








