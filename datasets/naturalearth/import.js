const path = require('path');

const Context = require('../../helper/Context');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');

const config = require('./config.json');

async function main(){
	var ctx = await Context.createContext();

	/* Create data directory */
	var datasetDir = ctx.createDirectory('naturalearth');

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
			schemaName: 'naturalearth',
			tableName: path.basename(dbfFile,'.dbf'),
			createSchema: true,
			createTable: true,
			promoteToMulti: true,
			skipFailures: true
		});
	});

	/* Cleanup directory and save metadata */
	datasetDir.remove();
	await ctx.metadata.add(config);
	await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});

