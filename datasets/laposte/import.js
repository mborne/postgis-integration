const Database = require('../../helper/Database');
const DatasetDir = require('../../helper/DatasetDir');
const SourceManager = require('../../helper/SourceManager');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');

const config = require('./config.json');
const SCHEMA_NAME = 'laposte';

async function main(){
	var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = await DatasetDir.createDirectory(SCHEMA_NAME);

	/* Adapt config */
	config.version = SourceManager.today();

	/* Download GeoJSON file */
	var jsonPath = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/codes-postaux.json'
	});

	/* Import data */
	ogr2pg({
		inputPath: jsonPath,
		schemaName: SCHEMA_NAME,
		tableName: 'codes_postaux',
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