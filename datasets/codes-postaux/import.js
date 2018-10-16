const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');

const config = require('./config.json');
const metadata = require('../../metadata');

async function main(){
	/* Create data directory */
	var datasetDir = new DatasetDir('codes-postaux');

	await metadata.remove(config.name);

	/* Adapt config */
	config.version = new Date().toISOString().slice(0,10);

	/* Change directory to data directory */
	shell.cd(datasetDir.getPath());

	/* Download GeoJSON file */
	var file = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/codes-postaux.json'
	});
	
	/* Import data */
	ogr2pg({
		inputPath: file,
		schemaName: 'laposte',
		tableName: 'codes_postaux',
		createTable: true,
		createSchema: true
	});

	/* Cleanup and save metadata */
	datasetDir.remove();
	await metadata.add(config);
}

main();
