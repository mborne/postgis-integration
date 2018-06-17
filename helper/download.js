const request = require('request');
const fs = require('fs');

/**
 * Download file
 * @param {Object} options
 * @param {String} options.sourceUrl
 * @param {String} options.targetPath
 * @returns {Promise}
 */
function download(options){
    console.log('Downloading '+options.sourceUrl+' to '+options.targetPath+' ...');
    return new Promise(function(resolve,reject){
        if ( fs.existsSync(options.targetPath) ){
            console.log('File '+options.targetPath+' already exists');
            resolve(options.targetPath);
            return;
        }

        var dest = fs.createWriteStream(options.targetPath);
        dest.on('finish', function () {
            console.log('File '+options.targetPath+' downloaded');
            resolve(options.targetPath);
        });

        var req = request({
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
