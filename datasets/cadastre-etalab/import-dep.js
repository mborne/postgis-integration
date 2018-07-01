const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');

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
var datasetDir = new DatasetDir('cadastre-etalab/'+CODE_DEP);

/* adapt config for partition */
config.name    = 'cadastre-etalab/'+CODE_DEP;
config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
config.version = new Date().toISOString().slice(0,10);

/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Download files */
var downloads = layerNames.map(function(layerName){
    var url = config.url
        .replace(/{LAYER}/g,layerName)
    ;
    console.log(url);
    return download({
        sourceUrl: url,
        targetPath: datasetDir.getPath()+'/'+layerName+'.zip'
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
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});








