const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');

const config = require('./config.json');
const SCHEMA_NAME = 'route500';

async function main(){
    var database = await Database.createDatabase();
    /* Import schema */
    await database.batch(__dirname+'/sql/schema.sql');

    /* Prepare local directory */
    var datasetDir = await DataDir.createDataDir(SCHEMA_NAME);

    /* Download archive */
    let archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/ROUTE500.7z'
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });


    /* group shapefiles by table */
    var shapefiles = {
        "NOEUD_ROUTIER": [],
        "COMMUNICATION_RESTREINTE": [],
        "TRONCON_ROUTE": []
    };
    datasetDir.getFiles().filter(function(file) {
        for ( var tableName in shapefiles ){
            if ( file.endsWith(tableName+'.shp') ){
                shapefiles[tableName].push(file);
            }
        }
    });

    /* import shapefiles */
    var tasks = [];
    for ( var tableName in shapefiles ){
        var tableShapefiles = shapefiles[tableName];
        tableShapefiles.forEach(function(tableShapefile){
            tasks.push(ogr2pg({
                inputPath: tableShapefile,
                schemaName: SCHEMA_NAME,
                tableName: tableName,
                promoteToMulti: false,
                encoding: 'LATIN1'
            }));
        });
    }
    await Promise.all(tasks);

    /* Save source */
    let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

    /* cleanup directory */
    datasetDir.remove();
    await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});