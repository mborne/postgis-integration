#!/usr/bin/env node

const Context  = require('../helper/Context');

async function main(){
    var ctx = await Context.createContext();
    await ctx.metadata.init();
    await ctx.close();
}

main().catch(function(err){
    console.log(err);
    process.exit(1);
});



