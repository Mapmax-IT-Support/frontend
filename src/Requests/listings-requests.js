import { API } from '../Constants'

export async function downloadListingImage(uri) {

    const data = { uri : uri } 
    return fetch(API + 'listings/download',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
        .then(response => response.blob())
        .catch(error => {
            console.error('Download Image error:', error)
        })
}

export async function createListing(data) {

    return fetch(API + 'listings/create',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Create listing error:', error)
        })
}

export async function setListingPhotos(formData) {
    
    return fetch(API + 'listings/photos/add',
    {
        method : 'POST',
        body : formData
    })
        .then(response => response.json())
        .catch(error => {
            console.error('upload photos error:', error)
        })
}

export async function getListingById(listingId) {
    
    return fetch(API + 'listings/id/' + listingId,
    {
        method : 'GET',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Get Listing errror:', error)
        })
}

export async function getListingByPlaceId(place_id, includeDrafts) {

    let body = { 
        "place_id": place_id,
        "includeDrafts": includeDrafts
    }
    
    return fetch(API + 'listings/place_id',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Get Listing errror:', error)
        })
}

export function getRecents() {
  
    return fetch(API + 'listings/recent',
        {
            method : 'GET',
        })
        .then(res => res.json())
        .catch(err => console.log("Recent Listings error", err))
}

export function getListings(start, limit) {
    let body = {
        "start" : start,
        "limit" : limit
    }

    return fetch(API + 'listings/get', 
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(err => console.log("Get Listings error", err))
}

// search near by
export function getNearbyListings(zip, distance) {
    let body = {
        "zip" : String(zip),
        "distance" : Number(distance)
    }

    return fetch(API + 'listings/nearby', 
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(err => console.log("Get Nearby Listings error", err))
}

// get by user_id
export function getListingByUserId(user_id) {
    let body = {
        "user_id" : String(user_id),
    }

    return fetch(API + 'listings/user_id', 
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(err => console.log("Get Listings by user_id error", err))
}

export async function deleteListing(listingId) {

    let body = {
        "listingId" : listingId
    }

    return fetch(API + 'listings/delete',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Create listing error:', error)
        })
}

export async function updateListing(data) {

    return fetch(API + 'listings/update',
    {
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Update listing error:', error)
        })
}