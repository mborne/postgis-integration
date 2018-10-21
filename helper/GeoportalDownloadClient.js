const debug = require('debug')('geoportal-download-client');

const axios = require('axios');
const parseString = require('xml2js').parseString;
const JSONPath = require('JSONPath');


/**
 * Client to simplify access to http://wxs-telechargement.ign.fr/
 * 
 * TODO use axios and externalize as a node module
 * 
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
     * List resources
     * @return {Promise}
     */
    getResources(){
        var urlCapabilities = this.options.url+"?request=GetCapabilities";
        return this.getUrlContent(urlCapabilities).then(function(xmlString){
            return this.parseResources(xmlString);
        }.bind(this));
    }

    /**
     * Parse XML resources
     * 
     * @private
     * 
     * @param {Promise} xmlString 
     */
    parseResources(xmlString){
        var self = this;
        return new Promise(function(resolve,reject){
            var resources = [];
            parseString(xmlString, function (err, data) {
                if ( err ){
                    reject("Fail to parse : "+xmlString);
                }
                debug(data);
                /* parse resource name */
                JSONPath({
                    json: data,
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
        });
    }

    /**
     * Get latest ressource
     * TODO manage version pattern (currently YYYY-MM-DD)
     * @return {Promise}
     */
    getLatestResource(){
        /* Extract version from name */
        return this.getResources().then(function(resources){
            /* split resource name according to _ and consider last part as version*/
            resources = resources.map(function(resource){
                var parts = resource.name.split('_');
                resource.version = parts[parts.length - 1];
                return resource;
            });
            /* Filter resources according to version pattern */
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
     * @return {Promise}
     */
    resolveFiles(resource){
        var urlFiles = this.options.url+"/"+resource.name;
        var self = this;
        return this.getUrlContent(urlFiles).then(function(xml){
            return self.parseFiles(resource,xml);
        });
    }

    /**
     * Parse XML files for a given resource
     * 
     * @private
     * 
     * @param {Object} resource 
     * @param {String} items 
     * @return {Promise}
     */
    parseFiles(resource,xmlString){
        let self = this;
        return new Promise(function(resolve,reject){
            parseString(xmlString,function(err,data){
                if ( err ){
                    reject("Fail to parse : "+xmlString);
                }
                debug(data);
                /* parse resource name */
                resource.files = [];
                JSONPath({
                    json: data,
                    path: '$.downloadFiles.files.*.file.*', 
                    callback: function(file){
                        debug(JSON.stringify(file,null,2));
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
        });
    }

    /**
     * Get URL content
     * 
     * @private
     * 
     * @param {String} url 
     * @return {Promise}
     */
    getUrlContent(url){
        debug("GET "+url);
        return axios({
            url: url,
            method: 'get',
            headers: {
                // missing User-Agent leads to error 500...
                'User-Agent': 'geoportal-download-client',
                'Accept': 'application/xml'
            }
        }).then(function(response){
            debug(response.data);
            return response.data;
        });
    };
}


module.exports = GeoportalDownloadClient;

