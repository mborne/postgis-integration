const shell = require('shelljs');

const psql = require('../../helper/psql');
const departements = require('../../resources/departements');

const metadata = require('../../metadata');

async function main(){
    /* import schema.sql */
    await psql({
        inputPath: __dirname+'/sql/schema.sql'
    })
    
    await metadata.remove('ban%');

    /* import each departement */
    departements.forEach(function(departement){
        var scriptPath = __dirname+"/import-dep.js";
        var command = "node "+scriptPath+" "+departement;
        if (shell.exec(command).code !== 0) {
            console.log('Error: fail to import departement '+departement);
        }
    });
}

main();




