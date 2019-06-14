const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');

const originalConfig = require('./config.json');
const SCHEMA_NAME = 'sirene';

async function main(){
    var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

    /* clone configuration */
    let config = Object.assign({}, originalConfig);

    /* Create data directory */
    var datasetDir = await DataDir.createDataDir('geosirene');

    /* Adapt config */
    config.version = SourceManager.today();

    /* Download archive */
    var archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/geo_sirene.csv.gz'
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });

    /*
     * Import table
     */
    await ogr2pg({
        inputPath: datasetDir.getPath()+'/geo_sirene.csv',
        schemaName: SCHEMA_NAME,
        tableName: 'etablissement'
    });

    /* Save source */
	let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

    /* Cleanup */
    datasetDir.remove();
    await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});
