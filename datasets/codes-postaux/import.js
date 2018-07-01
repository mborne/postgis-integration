const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');


/* Create data directory */
var datasetDir = new DatasetDir('codes-postaux');

/* Adapt config */
config.version = new Date().toISOString().slice(0,10);


/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Download GeoJSON file */
download({
	sourceUrl: config.url,
	targetPath: datasetDir.getPath()+'/codes-postaux.json'
}).then(function(file){
	/* Import data */
	return ogr2pg({
		inputPath: file,
		schemaName: 'laposte',
		tableName: 'codes_postaux',
		createTable: true,
        createSchema: true
	});
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
	console.log(err);
	shell.exit(1);
});

