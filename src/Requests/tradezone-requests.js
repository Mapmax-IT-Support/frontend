import { API } from '../Constants'
import { showError } from '../Actions/user-actions'

export function getCounty(center) {
    let lat = center.lat
    let lng = center.lng
    return fetch (API + 'bounds/county/' + lat + '/' + lng,
    {
        method : 'GET',
        credentials: "same-origin", //include, same-origin
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .catch(error => console.error('TZ error', error))
}

export async function getTradeZoneBounds(isCity, center) {
    let lat = center.lat
    let lng = center.lng
    return fetch (API + 'bounds/tradezone/' + isCity + '/' + lat + '/' + lng,
    {
        method : 'GET',
        credentials: "same-origin", //include, same-origin
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .catch(error => console.error('TZ error', error))
}

// zip code tz
export function getZipTradeZoneBounds(isCity, center) {
    let lat = center.lat
    let lng = center.lng
    return fetch (API + 'bounds/tradezone/zip/' + isCity + '/' + lat + '/' + lng,
    {
        method : 'GET',
        credentials: "same-origin", //include, same-origin
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .catch(error => console.error('TZ error', error))
}

export function getTradeZoneCartography(state, center, isCity, callback) {
    let lat = center.lat
    let lng = center.lng
    let url = API + 'tradezone/cartography/' + state.toLowerCase() + '/'
    + lat + '/'
    + lng + '/'
    + isCity
    fetch(url,
    {
        method: 'GET',
        credentials: "same-origin", //include, same-origin
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error('TZ error', error))
}

// tracts
export function getTradeZoneStats(center, bounds) {

    var formBody = {
        'bounds': bounds,
        "center" : center
    };
    
    return fetch(API + 'demo/stats/tradezone',
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
            console.error('Trade Zone Stats Error:', error)
        })
}

// blocks
export function getTradeZoneBlockStats(bounds) {

    var formBody = {
        'bounds': bounds
    };
    
    return fetch(API + 'demo/stats/tradezone/blocks',
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
            console.error('Trade Zone Stats Error:', error)
        })
}

// zip
export function getTradeZoneZipStats(bounds) {

    var formBody = {
        'bounds': bounds
    };
    
    return fetch(API + 'demo/stats/tradezone/zip',
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
            console.error('Trade Zone Stats Error:', error)
        })
}


export function getLoadedTradeZoneStats(pid, data_range) {

    var formBody = {
        'pid': pid,
        'range': data_range
    };
    
    return fetch(API + 'demo/stats/tradezone/loaded',
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
            console.error('Loaded Trade Zone Stats Error:', error)
        })
}