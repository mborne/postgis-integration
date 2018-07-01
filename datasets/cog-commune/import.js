const shell = require('shelljs');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');

if (!shell.which('unzip')) {
	shell.echo('Sorry, this script requires unzip');
	shell.exit(1);
}

/* Init schema */
if (shell.exec('psql -f '+__dirname+'/sql/schema.sql').code !== 0) {
    shell.echo('Error: import schema failed');
    shell.exit(1);
}

/* Create data directory */
var datasetDir = new DatasetDir('cog-commune');

/* Change directory to data directory */
shell.cd(datasetDir.getPath());

/* Download archive */
download({
	sourceUrl: config.url,
	targetPath: datasetDir.getPath()+'/commune.zip'
}).then(function(archive){
	/* Extract archive */
	if (shell.exec('unzip -o '+archive).code !== 0) {
		shell.echo('Error: archive extraction failed');
		shell.exit(1);
	}

	/* Find dbf file */
	var dbfFile = shell.find('.').filter(function(file){
		return file.endsWith('.dbf');
	})[0];

	return ogr2pg({
		inputPath: dbfFile,
		schemaName: 'cog',
		tableName: 'commune',
		encoding: 'ISO-8859-1'
	});
}).then(function(){
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
	console.log(err);
	shell.exit(1);
});
