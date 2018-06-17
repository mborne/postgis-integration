var departements = [];
for ( var code = 1; code <= 95; code++ ){
    if ( code === 20 ){
        continue;
    }
    departements.push(code < 10 ? '0'+code : ''+code);
}
departements.push("971");
departements.push("972");
departements.push("973");
departements.push("974");
departements.push("976");
departements.push("2A");
departements.push("2B");

module.exports = departements;
