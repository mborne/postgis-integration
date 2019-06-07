
const parseString = require('xml2js').parseString;
const fs = require('fs');

/**
 * Parse organisme as a GeoJSON feature
 * @param {string} file 
 */
function parseOrganisme(file){
    var xml = fs.readFileSync(file);
    var organisme = {
        'id': null,
        'properties': {},
        'geometry': null
    };
    parseString(xml, {'async': false}, function (err, item) {
        item = item.Organisme;

        organisme.id = item.$.id ;
        organisme.properties.insee = item.$.codeInsee ;
        organisme.properties.date_maj = item.$.dateMiseAJour;
        organisme.properties.pivot_local = item.$.pivotLocal
        organisme.properties.nom = item.Nom[0];
        organisme.properties.source = item.EditeurSource[0];
        organisme.properties.commentaire = item.Commentaire ? item.Commentaire.join("\r\n") : null;

        try {
            organisme.properties.email = item['CoordonnéesNum'][0]['Email'][0];
        }catch(e){
            organisme.properties.email = null;
        }

        var coordinates = [];
        item.Adresse.forEach(function(adresse){
            if ( ! adresse.Localisation ){
                return;
            }
            var lon = parseFloat(adresse.Localisation[0].Longitude) ;
            var lat = parseFloat(adresse.Localisation[0].Latitude) ;
            coordinates.push([lon,lat]);
        });

        organisme.geometry = {
            'type': 'MultiPoint',
            'coordinates': coordinates
        }
    });
    return organisme;
}

module.exports = parseOrganisme;
