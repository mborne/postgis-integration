const shell = require('shelljs');
const path = require('path');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

/* Create data directory */
var datasetDir = new DatasetDir('naturalearth');

/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Adapt config */
config.version = new Date().toISOString().slice(0,10);

/* Download archive */
download({
	sourceUrl: config.url,
	targetPath: datasetDir.getPath()+'/natural_earth_vector.zip'
}).then(function(archive){
	/* Extract archive */
	extract(archive);

	/* filter dbf files */
	var dbfFiles = shell.find('.').filter(function(file){
		if ( ! file.endsWith('.dbf') ){
			return false;
		}
		if ( file.match(/tools/g) ){
			return false;
		}
		return true;
	});

	/* import each dbf file */
	var tasks = dbfFiles.map(function(dbfFile){
		return ogr2pg({
			inputPath: dbfFile,
			schemaName: 'naturalearth',
			tableName: path.basename(dbfFile,'.dbf'),
			createSchema: true,
			createTable: true
		});
	});
	return Promise.all(tasks);
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
	console.log(err);
	shell.exit(1);
});


