const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

async function main(){
	var ctx = new Context();

	/* Init schema */
	await ctx.database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = ctx.createDirectory('cog-commune');

	/* Download archive */
	var archive = await download({
		sourceUrl: config.url,
		targetPath: datasetDir.getPath()+'/commune.zip'
	});
	
	/* Extract archive */
	extract(archive);

	/* Find dbf file */
	var dbfFile = datasetDir.getFiles().filter(function(file){
		return file.endsWith('.dbf');
	})[0];

	/* Import file */
	ogr2pg({
		inputPath: dbfFile,
		schemaName: 'cog',
		tableName: 'commune',
		encoding: 'ISO-8859-1'
	});

	/* Cleanup and save metadata */
	datasetDir.remove();
	await ctx.metadata.add(config);
	await ctx.close();
}

main();
