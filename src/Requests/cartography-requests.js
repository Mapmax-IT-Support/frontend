import { showError } from '../Actions/user-actions'
import { API } from '../Constants'

export function getZipCartography(state, zip) {
    let URL = API +'cart/zip/' + state.toLowerCase() +'/'+ zip
    return fetch(URL)
        .then(response => response.json())
        .catch(error =>  { 
            showError()
            console.error('Zip Cartography Error:', URL,  error)
        })
}

///zip/fetch/
export function fetchZipCartography(lat, lng) {

    let URL = API +'cart/zip/fetch/' + lat +'/'+ lng
    return fetch(URL)
        .then(response => response.json())
        .catch(error =>  { 
            showError()
            console.error('Zip Cartography Error:', URL,  error)
        })
}

export function getTradeZoneCartography(state, center, bounds) {

    var formBody = {
        'state': state,
        'center': center,
        'bounds' : bounds
    };
    
    return fetch(API + 'cart/tradezone',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Trade Zone Cartography Error:', error)
        })
}


export function getLoadedTradeZoneCartography(pid, data_range) {

    var formBody = {
        'pid': pid,
        'range': data_range
    };
    
    return fetch(API + 'cart/tradezone/loaded',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Loaded Trade Zone Cartography Error:', error)
        })
}

export function getTractCartography(state, tract) {
    return fetch(API +'cart/tract/' + state +'/'+ tract)
        .then(response => response.json())
        .catch(error =>  { 
            showError()
            console.error('Tract Cartograhpy Error:', error)
        })
}


