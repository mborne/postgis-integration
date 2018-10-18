const request = require('request');
const fs = require('fs');

const debug = require('debug')('download');

/**
 * Download file from a given sourceUrl to a targetPath
 * 
 * Note that a {targetPath}.part is created while downloading and is renamed to {targetPath}
 * when download is complete.
 * 
 * TODO : @mborne/download in a node-download repository
 * 
 * @param {Object} options
 * @param {String} options.sourceUrl
 * @param {String} options.targetPath
 * @returns {Promise}
 */
function download(options){
    debug('Downloading '+options.sourceUrl+' to '+options.targetPath+' ...');
    return new Promise(function(resolve,reject){
        if ( fs.existsSync(options.targetPath) ){
            debug('File '+options.targetPath+' already exists');
            resolve(options.targetPath);
            return;
        }

        /* Prepare temp file to avoid problems on script interruption */
        var tempPath = options.targetPath+'.part';
        if ( fs.existsSync(tempPath) ){
            fs.unlink(tempPath);
        }

        /* Download to tempPath, rename and resolve when download is complete */
        var dest = fs.createWriteStream(tempPath);
        dest.on('finish', function () {
            fs.renameSync(tempPath,options.targetPath);
            debug('File '+options.targetPath+' downloaded');
            resolve(options.targetPath);
        });

        /* Create request */
        request({
            url: options.sourceUrl,
            headers: {
                'User-Agent': 'nodejs'
            }
        }).on('response', function(response) {
            if ( response.statusCode !== 200 ){
                reject({
                    'code': response.statusCode,
                    'message': response.body,
                    'content-type': response.headers['content-type']
                });
            }
        }).pipe(dest);
    });
};

module.exports = download;
