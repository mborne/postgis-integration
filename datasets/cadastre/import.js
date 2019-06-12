const Database = require('../../helper/Database');
const DatasetDir = require('../../helper/DatasetDir');
const SourceManager = require('../../helper/SourceManager');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');

const originalConfig = require('./config.json');
const SCHEMA_NAME = 'cadastre';
const departements = require('./departements.json');

/**
 * Import a given departement
 * @param {Database} database
 * @param {string} CODE_DEP
 */
async function importDep(database,CODE_DEP){
    /* check param */
    if ( departements.indexOf(CODE_DEP) < 0 ){
        throw new Error(`Departement "${CODE_DEP}" not found`);
    }

    /* clone configuration */
    let config = Object.assign({}, originalConfig);

    /* Create data directory */
    var datasetDir = await DatasetDir.createDirectory('cadastre-etalab-'+CODE_DEP);

    /* Adapt config for partition */
    config.name        = 'cadastre-etalab/'+CODE_DEP;
    config.url         = originalConfig.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version     = SourceManager.today();

    /* Download and extract files */
    const layerNames = ["commune","section","feuille","parcelle","batiment"];
    var downloads = layerNames.map(function(layerName){
        var url = config.url
            .replace(/{LAYER}/g,layerName)
        ;
        return download({
            sourceUrl: url,
            targetPath: datasetDir.getPath()+'/'+layerName+'.zip'
        }).then(function(archivePath){
            return extract({
                archivePath: archivePath
            });
        })
    });
    await Promise.all(downloads);

    /* Import shapefiles... */
    layerNames.forEach(function(layerName){
        ogr2pg({
            inputPath: datasetDir.getPath()+'/'+layerName+'s.shp',
            tableName: layerName,
            schemaName: SCHEMA_NAME,
            encoding: 'LATIN1',
            promoteToMulti: true
        });
    });

    /* Save source */
    let sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
    await sourceManager.add(config);

    /* Cleanup */
    datasetDir.remove();
}


async function main(){
    let inputDepartements = process.argv.length < 3 ? null : process.argv[2] ;
    if ( inputDepartements != null ){
        inputDepartements = inputDepartements.split(",");
    }else{
        inputDepartements = departements;
    }

    var database = await Database.createDatabase();

    /* import schema.sql */
    await database.batch(__dirname+'/sql/schema.sql');

    for ( var i in inputDepartements ){
        let departement = inputDepartements[i];
        await importDep(departement);
    }

    /* create indexes */
    await database.batch(__dirname+'/sql/index.sql');

    await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});
