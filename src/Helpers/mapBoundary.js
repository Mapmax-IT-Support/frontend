export function getBoundaries(state, zip) {
    var data = getStateBounds(state)
    var boundary;
    for(var i = 0; i < data.features.length; i++) {
        var obj = data.features[i].properties.ZCTA5CE10;
        if (obj == zip) {
          boundary = data.features[i]
          return boundary;
        }
    } 
}

function getStateBounds(state) {
    var data = require('../map-data/'+ state.toLowerCase() +'_zipcodes.json'); 
    return data
}