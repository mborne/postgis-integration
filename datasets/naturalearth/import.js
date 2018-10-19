const path = require('path');

const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

async function main(){
	var ctx = new Context();

	/* Create data directory */
	var datasetDir = ctx.createDirectory('naturalearth');

	/* Adapt config */
	config.version = ctx.today();

	/* Download archive */
	var archive = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/natural_earth_vector.zip'
	});
	
	/* Extract archive */
	extract(archive);

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
			createTable: true
		});
	});

	/* Cleanup directory and save metadata */
	datasetDir.remove();
	await ctx.metadata.add(config);
	await ctx.close();
}

main();

