#!/usr/bin/env node

const Context  = require('../helper/Context');
const datasets = require('../datasets');

async function main(){
    var ctx = new Context();
    await ctx.metadata.init();
    await ctx.close();
}

main();



