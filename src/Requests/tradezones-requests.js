import { API } from '../Constants'
import { showError } from '../Actions/user-actions'

// get zip
export function getZipData(state, zip) {
    return fetch (`${API}tradezones/zip/${state}/${zip}`,
    {
        method : 'GET',
        credentials: "same-origin", //include, same-origin
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .catch(error => console.error('Tradezones zip error', error))
}

// get tradezone
export function getTradezoneData(state, zip, lat, lng, radius, isnyc) {
    let base =  `${API}tradezones/${state}/${zip}/${lat}/${lng}?radius=${radius}`;
    const URI = (isnyc) ? base+'&isnyc=true': base;

    return fetch (URI,
    {
        method : 'GET',
        credentials: "same-origin", //include, same-origin
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .catch(error => console.error('Tradezones error', error))
}