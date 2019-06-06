const Context = require('../../helper/Context');
const DatasetDir = require('../../helper/DatasetDir');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');

const config = require('./config.json');
const SCHEMA_NAME = 'adminexpress';

async function main(){
    var ctx = await Context.createContext();
    /* Import schema */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

    /* Prepare local directory */
    var datasetDir = await DatasetDir.createDirectory(SCHEMA_NAME);

    /* Download archive */
    let archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/ADMIN-EXPRESS.7z'
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });


    /* group shapefiles by table */
    var shapefiles = {
        "REGION": [],
        "DEPARTEMENT": [],
        "ARRONDISSEMENT_DEPARTEMENTAL": [],
        "EPCI": [],
        "COMMUNE": [],
        "CHEF_LIEU": []
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
                promoteToMulti: true
            }));
        });
    }
    await Promise.all(tasks);

    /* Save source */
    let sourceManager = await ctx.getSourceManager(SCHEMA_NAME);
	await sourceManager.add(config);

    /* cleanup directory */
    datasetDir.remove();
    await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});