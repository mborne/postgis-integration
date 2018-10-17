const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');

const config = require('./config.json');

async function main(){
	var ctx = new Context();

	/* Create data directory */
	var datasetDir = ctx.getDatasetDir('codes-postaux');
	await ctx.metadata.remove(config.name);

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
		schemaName: 'laposte',
		tableName: 'codes_postaux',
		createTable: true,
		createSchema: true
	});

	/* Cleanup and save metadata */
	datasetDir.remove();
	await ctx.metadata.add(config);
	await ctx.close();
}

main();
