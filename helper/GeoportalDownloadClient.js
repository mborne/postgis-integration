const request = require('request');
const parseString = require('xml2js').parseString;
const JSONPath = require('JSONPath');
const _ = require('lodash');

/**
 * Client to simplify access to http://wxs-telechargement.ign.fr/
 */
class GeoportalDownloadClient {
    /**
     * 
     * @param {Object} options 
     * @param {String} options.url service url (ex : https://wxs-telechargement.ign.fr/oikr5jryiph0iwhw36053ptm/telechargement/inspire)
     */
    constructor(options){
        this.options = options;
    }


    /**
     * Get URL
     * 
     * @private
     * 
     * @param {String} url 
     * @return Promise
     */
    getUrlContent(url){
        var options = {
            url: url,
            headers: {
                // missing User-Agent leads to error 500...
                'User-Agent': 'geoportal-download-client'
            }
        };
        return new Promise(function(resolve,reject){
            request(options, function (error, response, body) {
                if ( error ){
                    return reject(error);
                }
                resolve(body);
            });
        });
    };


    /**
     * List resources
     * @return Promise
     */
    getResources(){
        var urlCapabilities = this.options.url+"?request=GetCapabilities";

        const self = this;
        return new Promise(function(resolve,reject){
            self.getUrlContent(urlCapabilities)
                .then(function (xmlString) {
                    var resources = [];
                    parseString(xmlString, function (err, xml) {

                        /* parse resource name */
                        JSONPath({
                            json: xml,
                            path: '$.Download_Capabilities.Capability.*.Resources.*.Resource.*.Name.*', 
                            callback: function(resourceName){
                                resources.push({
                                    'type': 'Resource',
                                    'url': self.options.url+'/'+resourceName,
                                    'name': resourceName
                                })
                            }
                        });
                        resolve(resources);
                    });
                })
                .catch(function (err) {
                    reject(err);
                })
            ;
        });
    }

    /**
     * Get latest ressource
     * TODO manage version pattern (currently YYYY-MM-DD)
     */
    getLatestResource(){
        /* Extract version from name */
        return this.getResources().then(function(resources){
            resources = resources.map(function(resource){
                var parts = resource.name.split('_');
                resource.version = parts[parts.length - 1];
                return resource;
            });
            /* Filter data versions */
            resources = resources.filter(function(resource){
                return resource.version.match(/.*\-.*\-.*/)
            });
            /* Sort by version DESC */
            resources.sort(function(a,b){
                if ( a.version > b.version ){
                    return -1;
                }else if ( b.version > a.version ){
                    return 1;
                }else{
                    return 0;
                }
            });
            return resources[0];
        });
    }



    /**
     * Appends files to the given resource
     * @param {Object} resource 
     */
    resolveFiles(resource){
        var urlFiles = this.options.url+"/"+resource.name;
        
        const self = this;
        return new Promise(function(resolve,reject){
            self.getUrlContent(urlFiles).then(function(xmlString){
                parseString(xmlString, function (err, xml) {
                    resource.files = [];
                    JSONPath({
                        json: xml,
                        path: '$.downloadFiles.files.*.file.*', 
                        callback: function(file){
                            resource.files.push({
                                'type': 'File',
                                'name': file.fileName[0],
                                'md5': file.fileMd5[0],
                                'size': file.fileSize[0],
                                'url': self.options.url+"/"+resource.name+"/file/"+file.fileName[0]
                            });
                        }
                    });
                    resolve(resource);
                });
            }).catch(function(err){
                reject(error)
            });
        });
    }

}


module.exports = GeoportalDownloadClient;

