import { google } from '../Constants.js'

export const getDistance = (origin, destination, method) => {
    return new Promise((resolve, reject) => {
        let g_origin = new google.maps.LatLng(origin.lat, origin.lng);
        let g_destination = new google.maps.LatLng(destination.lat, destination.lng);
        let service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
        {
            origins: [g_origin],
            destinations: [g_destination],
            travelMode: method,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, (results, status) => {
            if (status != 'OK') {
                reject(status)
            } else {
                resolve(results)
            }
        });
    })
}

