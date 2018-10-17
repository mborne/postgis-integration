#!/usr/bin/env node

const Context  = require('../helper/Context');
const datasets = require('../datasets');

async function main(){
    var ctx = new Context();
    await ctx.metadata.init();

    for ( var datasetName in datasets ){
        var dataset = datasets[datasetName];
        await ctx.metadata.add(dataset);
    }

    await ctx.close();
}

main();



