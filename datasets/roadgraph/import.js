const {Database,SourceManager} = require('@mborne/postgis-helper');

const config = require('./config.json');
const SCHEMA_NAME = 'route500';

async function main(){
    const database = await Database.createDatabase();
    /* Import schema */
    await database.batch(__dirname+'/sql/schema.sql');
    /* Import route500 */
    await database.batch(__dirname+'/sql/import-route500.sql');

    /* Save source */
    const sourceManager = await SourceManager.createSourceManager(database,SCHEMA_NAME);
	await sourceManager.add(config);

    await database.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});