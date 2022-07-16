import { API, GOOGLE_KEY } from '../Constants'
const GEO_CODE = 'https://maps.googleapis.com/maps/api/geocode/json?';
const KEY = GOOGLE_KEY

// export function getGeoCode(street, city, state, callback) { 
//     var f_street = street.replace(/ /g, '+')
//     var f_city = city.replace(/ /g, '+')
//     var f_state = state.replace(/ /g, '+')
//     let f_address = f_street + ',' + '+'+f_city + ',' + '+'+f_state

//     fetch(GEO_CODE + 'address=' + f_address +'&key=' + KEY)
//         .then(response => response.json())
//         .then(data =>  callback(data));
// }

export function getNearby(address, type, callBack) {
    const lat = address.coords.lat
    const lng = address.coords.lng
    var token;
    fetch(API + 'places/nearby/' 
    + lat +'/'
    + lng + '/' 
    + type,
    {
        method: 'GET',
        credentials: "same-origin", //include, same-origin
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response => {
        token = response.headers.get('Pragma')
        return response.json()
    })
    .then(data => callBack(data, token))
    .catch(error => console.error('Error:', error))
}

export function getPages(token, callBack) {
    if (token != null) {
            fetch(API + 'places/pages/' + token, {
                method: 'GET',
                credentials: "same-origin", //include, same-origin
                headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            })
            .then(response => {
                token = response.headers.get('Pragma')
                return response.json()
            })
            .then(data => callBack(data, token))
            .catch(error => console.error('Error:', error))
    }
}

export function getPhoto(ref, width, height, callback) {
    fetch(API + 'places/photos/' + ref + '/' + width + '/' + height,
    {
        method : 'GET',
        credentials: "same-origin",
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response =>  response.json())
    .then(data => callback(data))
    .catch(error => console.error('Photo fetch error:', error))
}

