const shell = require('shelljs');

const createDataDir = require('../../helper/createDataDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const config = require('./config.json');


/* Create data directory */
var dataDir = createDataDir({
	datasetName: 'codes-postaux'
});

/* Change directory to data directory */
shell.cd(dataDir);

/* Download GeoJSON file */
download({
	sourceUrl: config.url,
	targetPath: dataDir+'/codes-postaux.json'
}).then(function(file){
	/* Import data */
	return ogr2pg({
		inputPath: file,
		schemaName: 'laposte',
		tableName: 'codes_postaux',
		createTable: true,
        createSchema: true
	});
}).catch(function(err){
	console.log(err);
	shell.exit(1);
});

