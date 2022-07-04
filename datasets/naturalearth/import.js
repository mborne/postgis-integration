const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');
const path = require('path');

const config = require('./config.json');
const SCHEMA_NAME = 'naturalearth';

async function main(){
	var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = await DataDir.createDataDir(SCHEMA_NAME);

	/* Download archive */
	var archivePath = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/natural_earth_vector.zip'
	});

	/* Extract archive */
	await extract({
		archivePath: archivePath
	});

	/* filter dbf files */
	var dbfFiles = datasetDir.getFiles().filter(function(file){
		if ( ! file.endsWith('.dbf') ){
			return false;
		}
		if ( file.match(/tools/g) ){
			return false;
		}
		return true;
	});

	/* Import each dbf file */
	dbfFiles.forEach(function(dbfFile){
		ogr2pg({
			inputPath: dbfFile,
			schemaName: SCHEMA_NAME,
			tableName: path.basename(dbfFile,'.dbf'),
			createSchema: false,
			createTable: true,
			promoteToMulti: true,
			skipFailures: true
		});
	});

	/* Save source */
	let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

	/* Cleanup directory */
	datasetDir.remove();
	await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});

