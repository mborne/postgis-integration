const fs = require('fs');
const path = require('path');

const config = {};

config.DATA_DIR = ( typeof process.env.DATA_DIR === 'undefined' ) ? 
    path.resolve(__dirname,'../../data')
    :
    path.resolve( process.env.DATA_DIR )
;

module.exports = config;
