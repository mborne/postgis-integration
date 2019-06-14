const Database = require('../../helper/Database');
const DataDir = require('../../helper/DataDir');
const SourceManager = require('../../helper/SourceManager');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
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
	let tableNames = await database.getTableNames(SCHEMA_NAME);

	/* Find dbf file */
	var dbfFiles = tableNames.map(function(tableName){
		return path.resolve( datasetDir.path, tableName+config.version+'.dbf' );
	});

	for ( var i in dbfFiles ){
		let dbfFile = dbfFiles[i];
		if ( ! fs.existsSync(dbfFile) ){
			throw new Error(`File not found : ${dbfFile}`);
		}

		/* Import file */
		await ogr2pg({
			inputPath: dbfFile,
			schemaName: SCHEMA_NAME,
			// commune2019.dbf -> commune
			tableName: path.basename(dbfFile,'.dbf').replace(config.version,''),
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