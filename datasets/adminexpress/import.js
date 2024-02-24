const { Database, SourceManager } = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');
const path = require('path');

const config = require('./config.json');
const SCHEMA_NAME = 'adminexpress';

async function main() {
    var database = await Database.createDatabase();
    /* Import schema */
    await database.batch(__dirname + '/sql/schema.sql');

    /* Prepare local directory */
    var datasetDir = await DataDir.createDataDir(SCHEMA_NAME);

    /* Download archive */
    let archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath() + '/ADMIN-EXPRESS.7z'
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });

    /* import shapefiles */
    var tasks = [];

    for (const file of datasetDir.getFiles()) {
        if (!file.endsWith('.shp')) {
            continue;
        }
        const tableName = path.parse(file).name;
        tasks.push(ogr2pg({
            inputPath: file,
            schemaName: SCHEMA_NAME,
            tableName: tableName,
            promoteToMulti: true,
            createTable: true
        }));
    }

    await Promise.all(tasks);

    /* Save source */
    let sourceManager = await SourceManager.createSourceManager(database, SCHEMA_NAME);
    await sourceManager.add(config);

    /* cleanup directory */
    datasetDir.remove();
    await database.close();
}

main().catch(function (err) {
    console.log(err);
    process.exit(1);
});