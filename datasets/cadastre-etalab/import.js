const originalConfig = require('./config.json');
const departements = require('../../resources/departements');

const Context = require('../../helper/Context');
const download = require('../../helper/download');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('../../helper/extract');

/**
 * Import a given departement
 * @param {Context} ctx 
 * @param {String} CODE_DEP 
 */
async function importDep(ctx,CODE_DEP){
    /* clone configuration */
    let config = Object.assign({}, originalConfig);

    /* Create data directory */
    var datasetDir = ctx.createDirectory('cadastre-etalab-'+CODE_DEP);

    /* adapt config for partition */
    config.name        = 'cadastre-etalab/'+CODE_DEP;
    config.parent_name = originalConfig.name;
    config.url         = originalConfig.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version     = ctx.today();

    /* Download and extract files */
    const layerNames = ["commune","section","feuille","parcelle","batiment"];
    var downloads = layerNames.map(function(layerName){
        var url = config.url
            .replace(/{LAYER}/g,layerName)
        ;
        return download({
            sourceUrl: url,
            targetPath: datasetDir.getPath()+'/'+layerName+'.zip'
        }).then(function(archiveFile){
            extract(archiveFile);
        })
    });
    await Promise.all(downloads);

    /* Import shapefiles... */
    layerNames.forEach(function(layerName){
        ogr2pg({
            inputPath: datasetDir.getPath()+'/'+layerName+'s.shp',
            tableName: layerName,
            schemaName: 'cadastre',
            encoding: 'LATIN1'
        });
    });

    datasetDir.remove();
    await ctx.metadata.add(config);
}


async function main(){
    var ctx = new Context();

    /* import schema.sql */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

    /* remove children datasets */    
    await ctx.metadata.remove('cadastre-etalab%');

    /* add parent dataset */
    let config = Object.assign({}, originalConfig);
    config.version = ctx.today();
    await ctx.metadata.add(config);

    /* import each departement */
    for ( var i in departements ){
        const departement = departements[i];
        await importDep(ctx,departement);
    }

    await ctx.close();
}

main();





