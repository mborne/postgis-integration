const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('@mborne/ogr2pg');

const extract = require('../../helper/extract');

const config = require('./config.json');
const GeoportalDownloadClient = require('../../helper/GeoportalDownloadClient');

async function main(){
    var ctx = await Context.createContext();

    /* Create data directory */
    var datasetDir = ctx.createDirectory('adminexpress');

    /* Remove existing metadata */
    await ctx.metadata.remove(config.name);

    /* Find last version URL */
    var client = new GeoportalDownloadClient({
        url: config.url
    });
    let resource = await client.getLatestResource();
    resource = await client.resolveFiles(resource);

    /* Adapt configuration to latest version */
    config.url     = resource.files[0].url;
    config.version = resource.version;

    /* Download archive */
    let archive = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/ADMIN-EXPRESS.7z'
    });

    /* Extract archive */
    extract(archive);

    /* Import schema */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

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
                schemaName: 'adminexpress',
                tableName: tableName,
                promoteToMulti: true
            }));
        });
    }
    await Promise.all(tasks);

    /* cleanup directory and save metadata */
    datasetDir.remove();
    await ctx.metadata.add(config);
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});