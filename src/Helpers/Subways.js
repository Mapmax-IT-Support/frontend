import { getDistance } from '../Requests/directions-requests' 
import { getSubwayTotals } from '../Requests/subway-requests'


export const hasSubways = zip => {
    return (Number(zip) >= 10001 && Number(zip) <= 11697)
}

export const getDistancesFromMap = async (placeMap, origin) => {
    return new Promise(async (resolve, reject) => {
        let method = 'WALKING'
        let subways = new Map()
        let i = 0;
        for (let [pid, place] of placeMap) {
            if (i > 4) break;

            let destination = place.geometry.location
            let res = await getDistance(origin, destination, method)
            if (res.rows[0].elements[0].duration.value <= 630) { // 630 sec, 10.5 min
                subways.set(pid, {directions: res.rows[0].elements[0], place: place})
            }
            i += 1;
        }
        let coords = []
        let places = []
        for (let e of subways) {
            coords.push(e[1].place.geometry.location)
        //    places.push(e.place)
        }
        let results = await getSubwayTotals(coords)
        for (let e of results) {
            let destination = {lat: Number(e.data.G_LAT), lng: Number(e.data.G_LNG)}
            
            let dir = await getDistance(origin, destination, method)
            e.directions = dir.rows[0].elements[0]
         //   e.place = places[i]
        }
        // sort by distance
        results.sort((a,b) => a.directions.distance.value - b.directions.distance.value)
        resolve(results)
    })
}


