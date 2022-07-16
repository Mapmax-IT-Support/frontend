import { showError } from '../Actions/user-actions'
import { API } from '../Constants'


export async function createLocation(pid, location) {

    var formBody = {
        'pid': pid,
        'location': location
    };
    
    return fetch(API + 'locations/create',
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
            console.error('Create location error:', error)
        })
}

export async function getLocation(pid) {
    
    return fetch(API + 'locations/' + pid,
    {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Location fetch Error:', error)
        })
}

export async function getComments(pid) {
    
    return fetch(API + 'locations/comments/' + pid,
    {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Comments Fetch Error:', error)
        })
}

export async function createComment(pid, user, body) {

    var formBody = {
        'pid': pid,
        'user': user,
        'body': body
    };
    
    return fetch(API + 'locations/comments/create',
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
            console.error('Create Comment error:', error)
        })
}

// /tradezone/cartography/create
export async function createTradeZoneCartography(pid, cartography, data_range) {

    var formBody = {
        'pid': pid,
        'cartography': cartography,
        'range': data_range
    };
    
    return fetch(API + 'locations/tradezone/cartography/create',
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
            console.error('Create Tradezone cartography error:', error)
        })
}

// /tradezone/stats/create
export async function createTradeZoneStats(pid, stats, data_range) {

    var formBody = {
        'pid': pid,
        'stats': stats,
        'range': data_range
    };
    
    return fetch(API + 'locations/tradezone/stats/create',
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
            console.error('Create Tradezone stats error:', error)
        })
}