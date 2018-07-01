const shell = require('shelljs');
const Promise = require('bluebird');

const DatasetDir = require('../../helper/DatasetDir');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const psql = require('../../helper/psql');

const extract = require('../../helper/extract');

const config = require('./config.json');
const GeoportalDownloadClient = require('../../helper/GeoportalDownloadClient');

var client = new GeoportalDownloadClient({
    url: config.url
});

/* Create data directory */
var datasetDir = new DatasetDir('adminexpress');

/* Find last resources */
client.getLatestResource().then(function(resource){
    /* Find files */
    return client.resolveFiles(resource);
}).then(function(resource){
    config.url     = resource.files[0].url;
    config.version = resource.version;

    /* Change directory to data directory */
    shell.cd(datasetDir.getPath());
    /* Download archive */
    return download({
        sourceUrl: resource.files[0].url,
        targetPath: datasetDir.getPath()+'/ADMIN-EXPRESS.7z'
    });
}).then(function(){
    extract('ADMIN-EXPRESS.7z');
}).then(function(){
    /* Create schema */
    return psql({
        inputPath: __dirname+'/sql/schema.sql'
    });
}).then(function(){
    /* group shapefiles by table */
    var shapefiles = {
        "REGION": [],
        "DEPARTEMENT": [],
        "ARRONDISSEMENT_DEPARTEMENTAL": [],
        "EPCI": [],
        "COMMUNE": [],
        "CHEF_LIEU": []
    };
    shell.find('.').filter(function(file) {
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
                tableName: tableName
            }));
        });
    }
    return Promise.all(tasks,{concurrency:1});
}).then(function(){
    /* cleanup directory and save metadata */
    datasetDir.cleanup();
    datasetDir.saveMetadata(config);
}).catch(function(err){
    console.log(err);
    shell.exit(1);  
});
