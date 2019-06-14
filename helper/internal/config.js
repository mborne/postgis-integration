const fs = require('fs');
const path = require('path');

if ( typeof process.env.DATA_DIR === 'undefined' ){
    throw new Error('DATA_DIR environment variable is mandatory');
}

const config = {
    DATA_DIR: path.resolve( process.env.DATA_DIR )
};

module.exports = config;
