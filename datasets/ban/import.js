const originalConfig = require('./config.json');
const Context = require('../../helper/Context');
const download = require('../../helper/download');
const extract = require('../../helper/extract');
const ogr2pg = require('../../helper/ogr2pg');

const psql = require('../../helper/psql');
const departements = require('../../resources/departements');

/**
 * Import a given department
 * @param {Context} ctx
 * @param {String} CODE_DEP 
 */
async function importDep(ctx,CODE_DEP){
    /* clone configuration */
    let config = Object.assign({}, originalConfig);
    
    /* Create data directory */
    var datasetDir = ctx.getDatasetDir('ban-'+CODE_DEP);

    /* adapt config for partition */
    config.name        = 'ban/'+CODE_DEP;
    config.parent_name = originalConfig.name;
    config.url         = originalConfig.url.replace(/{CODE_DEP}/g,CODE_DEP);
    config.version     = ctx.today();

    /* Download archive */
    await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/ban.zip'
    });

    /* Extract archive */
    extract(datasetDir.getPath()+'/ban.zip');

    await ogr2pg({
        inputPath: datasetDir.getPath()+'/BAN_licence_gratuite_repartage_'+CODE_DEP+'.csv',
        schemaName: 'ban',
        tableName: 'adresse'
    });

    datasetDir.remove();
    await ctx.metadata.add(config);
}


async function main(){
    var ctx = new Context();

    /* import schema.sql */
    await psql({
        inputPath: __dirname+'/sql/schema.sql'
    })
    
    /* remove children datasets */    
    ctx.metadata.remove('ban%');

    /* add parent dataset */
    let config = Object.assign({}, originalConfig);
    config.version = ctx.today();
    await ctx.metadata.add(config);

    /* import each departement */
    for ( var i in departements ){
        const departement = departements[i];
        await importDep(ctx,departement);
    }
}

main();




