const shell = require('shelljs');

const createDataDir = require('../../helper/createDataDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');

const path = require('path');

if (!shell.which('unzip')) {
	shell.echo('Sorry, this script requires unzip');
	shell.exit(1);
}

/* Create data directory */
var dataDir = createDataDir({
	datasetName: 'naturalearth'	
});

/* Change directory to data directory */
shell.cd(dataDir);

/* Download archive */
download({
	sourceUrl: config.url,
	targetPath: dataDir+'/natural_earth_vector.zip',
	overwrite: false
}).then(function(archive){
	/* Extract archive */
	if (shell.exec('unzip -o '+archive).code !== 0) {
		shell.echo('Error: unzip failed');
		shell.exit(1);
	}

	/* filter dbf files */
	var dbfFiles = shell.find('.').filter(function(file){
		if ( ! file.endsWith('.dbf') ){
			return false;
		}
		if ( file.match(/tools/g) ){
			return false;
		}
		return true;
	});

	/* import each dbf file */
	var tasks = dbfFiles.map(function(dbfFile){
		return ogr2pg({
			inputPath: dbfFile,
			schemaName: 'naturalearth',
			tableName: path.basename(dbfFile,'.dbf')
		});
	});
	return Promise.all(tasks);
}).catch(function(err){
	console.log(err);
	shell.exit(1);
});


