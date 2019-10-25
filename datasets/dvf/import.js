const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');

const config = require('./config.json');
const SCHEMA_NAME = 'dvf';

async function main(){
	var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = await DataDir.createDataDir(SCHEMA_NAME);

	/* Download GeoJSON file */
	var archivePath = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/full.csv.gz'
	});

	await extract({
		archivePath: archivePath
	});

	// /* Import data */
	await ogr2pg({
		inputPath: datasetDir.getPath()+'/full.csv',
		schemaName: SCHEMA_NAME,
		tableName: 'mutation',
		createTable: false,
		createSchema: false
	});

	/* Save source */
	let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

	/* Cleanup */
	datasetDir.remove();
	await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});