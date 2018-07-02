const shell = require('shelljs');
const path = require('path');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

async function main(){
	/* Create data directory */
	var datasetDir = new DatasetDir('naturalearth');

	/* Change directory to data directory */
	shell.cd(datasetDir.getPath());

	/* Adapt config */
	config.version = new Date().toISOString().slice(0,10);

	/* Download archive */
	var archive = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/natural_earth_vector.zip'
	});
	
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
	dbfFiles.forEach(function(dbfFile){
		ogr2pg({
			inputPath: dbfFile,
			schemaName: 'naturalearth',
			tableName: path.basename(dbfFile,'.dbf'),
			createSchema: true,
			createTable: true
		});
	});

	/* Cleanup directory and save metadata */
	datasetDir.cleanup();
	datasetDir.saveMetadata(config);
}

main();

