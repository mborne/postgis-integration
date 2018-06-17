const shell = require('shelljs');

const psql = require('../../helper/psql');
const departements = require('../../resources/departements');

/* import schema.sql */
psql({
    inputPath: __dirname+'/sql/schema.sql'
}).then(function(){
    /* import each departement */
    departements.forEach(function(departement){
        var scriptPath = __dirname+"/import-dep.js";
        var command = "node "+scriptPath+" "+departement;
        if (shell.exec(command).code !== 0) {
            console.log('Error: fail to import departement '+departement);
        }
    });
}).catch(function(err){
    console.log(err);
    shell.exit(1);
});


