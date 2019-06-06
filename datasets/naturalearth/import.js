const Context = require('../../helper/Context');
const DatasetDir = require('../../helper/DatasetDir');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const path = require('path');

const config = require('./config.json');
const SCHEMA_NAME = 'naturalearth';

async function main(){
	var ctx = await Context.createContext();

	/* Create data directory */
	var datasetDir = await DatasetDir.createDirectory(SCHEMA_NAME);

	/* Adapt config */
	config.version = ctx.today();

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

	/* import each dbf file */
	dbfFiles.forEach(function(dbfFile){
		ogr2pg({
			inputPath: dbfFile,
			schemaName: SCHEMA_NAME,
			tableName: path.basename(dbfFile,'.dbf'),
			createSchema: true,
			createTable: true,
			promoteToMulti: true,
			skipFailures: true
		});
	});

	/* Save source */
	let sourceManager = await ctx.getSourceManager(SCHEMA_NAME);
	await sourceManager.add(config);

	/* Cleanup directory */
	datasetDir.remove();
	await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});

