const Context = require('../../helper/Context');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const path = require('path');

const config = require('./config.json');

async function main(){
	var ctx = await Context.createContext();

	/* Init schema */
	await ctx.database.batch(__dirname+'/sql/schema.sql');

	/* Create data directory */
	var datasetDir = ctx.createDirectory('cog');

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

	/* Find dbf file */
	var dbfFiles = datasetDir.getFiles().filter(function(file){
		return file.endsWith('.dbf');
	});

	for ( var i in dbfFiles ){
		let dbfFile = dbfFiles[i];
		/* Import file */
		await ogr2pg({
			inputPath: dbfFile,
			schemaName: 'cog',
			// commune2019.dbf -> commune
			tableName: path.basename(dbfFile,'.dbf').replace(config.version,''),
			encoding: 'ISO-8859-1'
		});
	}

	/* Cleanup and save metadata */
	datasetDir.remove();
	await ctx.metadata.add(config);
	await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});