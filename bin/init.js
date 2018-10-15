#!/usr/bin/env node

const metadata = require('../metadata');

async function main(){
    await metadata.init();
}

main();



