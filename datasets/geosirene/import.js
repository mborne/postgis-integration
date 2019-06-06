const Context = require('../../helper/Context');
const DatasetDir = require('../../helper/DatasetDir');
const download = require('@mborne/dl');
const ogr2pg = require('@mborne/ogr2pg');
const extract = require('@mborne/extract');

const originalConfig = require('./config.json');

async function main(){
    var ctx = await Context.createContext();

    /* import schema.sql */
    await ctx.database.batch(__dirname+'/sql/schema.sql');

    /* remove children datasets */
    ctx.metadata.remove('geosirene');

    /* clone configuration */
    let config = Object.assign({}, originalConfig);

    /* Create data directory */
    var datasetDir = await DatasetDir.createDirectory('geosirene');

    /* Adapt config */
    config.version = ctx.today();

    /* Download archive */
    var archivePath = await download({
        sourceUrl: config.url,
        targetPath: datasetDir.getPath()+'/geo_sirene.csv.gz'
    });

    /* Extract archive */
    await extract({
        archivePath: archivePath
    });

    /* Import table */
    ogr2pg({
        inputPath: datasetDir.getPath()+'/geo_sirene.csv',
        schemaName: 'sirene',
        tableName: 'etablissement'
    });

    /* Cleanup and save metadata */
    datasetDir.remove();
    await ctx.metadata.add(config);
    await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});
