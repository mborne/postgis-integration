
/**
 * Get environment variable
 * @param {string} name
 * @param {string} [defaultValue=null]
 */
function getEnv(name,defaultValue=null){
    return typeof process.env[name] !== 'undefined' ?
        process.env[name] : defaultValue
    ;
}

module.exports = getEnv;