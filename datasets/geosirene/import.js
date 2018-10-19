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
    var datasetDir = ctx.createDirectory('geosirene-'+CODE_DEP);

    /* Adapt config */
    config.name    = 'geosirene/'+CODE_DEP;
    config.url     = config.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version = ctx.today();

    /* Download archive */
    var archive = await download({
        sourceUrl: config.url.replace('{CODE_DEP}',CODE_DEP),
        targetPath: datasetDir.getPath()+'/sirene.7z'
    });
    
    /* Extract archive */
    extract(archive);

    /* Import table */
    ogr2pg({
        inputPath: datasetDir.getPath()+'/geo-sirene_'+CODE_DEP+'.csv',
        schemaName: 'sirene',
        tableName: 'etablissement'
    });
    
    /* Cleanup and save metadata */
    datasetDir.remove();
    await ctx.metadata.add(config);
}


async function main(){
    var ctx = new Context();

    /* import schema.sql */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

    /* remove children datasets */    
    ctx.metadata.remove('geosirene%');

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