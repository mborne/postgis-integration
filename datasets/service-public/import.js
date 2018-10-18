const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('../../helper/ogr2pg');
const extract = require('../../helper/extract');

const config = require('./config.json');

const fs = require('fs');
const parseOrganisme = require('./helper/parseOrganisme');

async function main() {
    var ctx = new Context();

    /* Create data directory */
    var datasetDir = ctx.createDirectory('annuaire-administration');

    /* Adapt config */
    // TODO retrieve from folder name (ex : all_20181016)
    config.version = new Date().toISOString().slice(0, 10);

    /* Download archive */
    var archive = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath() + '/all_latest.tar.bz2'
    });

    /* Extract archive */
    extract(archive);

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
        schemaName: 'dila',
        tableName: 'organisme',
        createSchema: true,
        createTable: true
    });

    /* Cleanup directory and save metadata */
    datasetDir.remove();
    await ctx.metadata.add(config);
    await ctx.close();
}

main();

