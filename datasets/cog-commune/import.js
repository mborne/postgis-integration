const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const psql = require('../../helper/psql');
const extract = require('../../helper/extract');

const config = require('./config.json');
const metadata = require('../../metadata');

async function main(){

	/* Init schema */
	psql({
		inputPath: __dirname+'/sql/schema.sql'
	});

	await metadata.remove(config.name);

	/* Create data directory */
	var datasetDir = new DatasetDir('cog-commune');

	/* Change directory to data directory */
	shell.cd(datasetDir.getPath());

	/* Download archive */
	var archive = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/commune.zip'
	});
	
	/* Extract archive */
	extract(archive);

	/* Find dbf file */
	var dbfFile = shell.find('.').filter(function(file){
		return file.endsWith('.dbf');
	})[0];

	/* Import file */
	ogr2pg({
		inputPath: dbfFile,
		schemaName: 'cog',
		tableName: 'commune',
		encoding: 'ISO-8859-1'
	});
	
	/* Cleanup and save metadata */
	datasetDir.remove();
	await metadata.add(config);
}

main();
