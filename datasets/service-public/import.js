const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');

var fs = require('fs');
const parseOrganisme = require('./helper/parseOrganisme');

if (!shell.which('tar')) {
	shell.echo('Sorry, this script requires tar');
	shell.exit(1);
}

/* Create data directory */
var datasetDir = new DatasetDir('annuaire-administration');

/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Adapt config */
config.version = new Date().toISOString().slice(0,10);

/* Download archive */
download({
    sourceUrl: config.url,
    targetPath: datasetDir.getPath()+'/all_latest.tar.bz2'
}).then(function(){
    /* Extract archive */
    if (shell.exec('tar xf all_latest.tar.bz2').code !== 0) {
        shell.echo('Error: archive extraction failed');
        shell.exit(1);
    }
}).then(function(){
    /* List organismes */
    var organismes = shell.find('.').filter(function(file) { 
        if ( ! file.match(/\.xml$/) ){
            return false;
        }
        if ( ! file.match(/organismes/) ){
            return false;
        }
        return true;
    });

    /* Convert XML to GeoJSON */
    var featureCollection = {
        'type': 'FeatureCollection',
        'features': []
    }
    organismes.forEach(function(file){
        var organisme = parseOrganisme(file);
        featureCollection.features.push(organisme);
    });
    return featureCollection;
}).then(function(featureCollection){
    fs.writeFileSync('organisme.json',JSON.stringify(featureCollection,null,2));

    return ogr2pg({
        inputPath: 'organisme.json',
        schemaName: 'dila',
        tableName: 'organisme',
        createSchema: true,
        createTable: true
    });
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});







