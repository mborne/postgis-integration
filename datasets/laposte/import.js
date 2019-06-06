const Context = require('../../helper/Context');
const DatasetDir = require('../../helper/DatasetDir');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');

const config = require('./config.json');
const SCHEMA_NAME = 'laposte';

async function main(){
	var ctx = await Context.createContext();

    /* import schema.sql */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = await DatasetDir.createDirectory(SCHEMA_NAME);

	/* Adapt config */
	config.version = ctx.today();

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
	let sourceManager = await ctx.getSourceManager(SCHEMA_NAME);
	await sourceManager.add(config);

	/* Cleanup */
	datasetDir.remove();
	await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});