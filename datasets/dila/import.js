const {Database,SourceManager} = require('@mborne/postgis-helper');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');
const DataDir = require('../../helper/DataDir');

const config = require('./config.json');
const SCHEMA_NAME = 'dila';

const fs = require('fs');
const parseOrganisme = require('./helper/parseOrganisme');

async function main() {
    var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

    /* Create data directory */
    var datasetDir = await DataDir.createDataDir('dila');

    /* Adapt config */
    // TODO retrieve from folder name (ex : all_20181016)
    config.version = SourceManager.today();

    /* Download archive */
    var archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath() + '/all_latest.tar.bz2',
        unsafeSsl: true
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });

    /* List organismes */
    var organismes = datasetDir.getFiles().filter(function (file) {
        if (!file.match(/\.xml$/)) {
            return false;
        }
        if (!file.match(/organismes/)) {
            return false;
        }
        return true;
    });

    /* Convert XML to GeoJSON */
    var featureCollection = {
        'type': 'FeatureCollection',
        'features': []
    }
    organismes.forEach(function (file) {
        var organisme = parseOrganisme(file);
        featureCollection.features.push(organisme);
    });

    /* Load GeoJSON with ogr2pg */
    var jsonPath = datasetDir.getPath()+'/organisme.json';
    fs.writeFileSync(jsonPath, JSON.stringify(featureCollection, null, 2));
    ogr2pg({
        inputPath: jsonPath,
        schemaName: SCHEMA_NAME,
        tableName: 'organisme'
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
