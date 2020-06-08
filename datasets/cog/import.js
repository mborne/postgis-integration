const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');
const path = require('path');
const fs = require('fs');

const config = require('./config.json');
const SCHEMA_NAME = 'cog';

async function main(){
	var database = await Database.createDatabase();

	/* Init schema */
	await database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = await DataDir.createDataDir(SCHEMA_NAME);

	/* Download archive */
	var archivePath = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/commune.zip',
		unsafeSsl: true
	});

	/* Extract archive */
	await extract({
		archivePath: archivePath
	});

	/* retreive expected tables */
	//let tableNames = await database.getTableNames(SCHEMA_NAME);
	let dbfFiles = datasetDir.getFiles().filter(function(file){
		return file.endsWith('.dbf');
	});

	for ( const dbfFile of dbfFiles ){
		let tableName = path.basename(dbfFile,'.dbf').replace('2020','');
		// for consistency
		if ( tableName == 'communes' ){
			tableName = 'commune';
		}
		/* Import file */
		await ogr2pg({
			inputPath: dbfFile,
			schemaName: SCHEMA_NAME,
			tableName: tableName,
			encoding: 'ISO-8859-1'
		});
	}

	/* Save source */
	let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

	/* Cleanup and save metadata */
	datasetDir.remove();
	await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});