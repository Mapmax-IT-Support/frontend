import { getTradeZoneCartography} from "../Requests/cartography-requests" 

// block groups
export const getBlockGroups = async  (tzBounds, state) => {
    let bounds = tzBounds
    let results = []
    state = state.toLowerCase()

    // get correct state
    const data = await getTradeZoneCartography(state, 'block')

    for (let i=0; i < data.length; i++) {

        // check if matching bounds 
        for (let j = 0; j < bounds.length; j++) {

            // county
            if (data[i].properties.COUNTYFP != bounds[j][0].county) {
                continue;
            }
           
            // tract
            if (data[i].properties.TRACTCE != bounds[j][0].tract) {
                continue;
            }

            // Block
            if (data[i].properties.BLKGRPCE != bounds[j][0]['block-group']) {
                continue;
            }

            results.push(data[i])
        } 
    }

    return results;
}

// tracts
export const getTracts = async (tzBounds, state) => {
    let bounds = tzBounds
    let results = []
    state = state.toLowerCase()

    
    // get correct state
    const data = await getTradeZoneCartography(state, 'tract')

    for (let i=0; i < data.length; i++) {

        // check if matching bounds 
        for (let j = 0; j < bounds.length; j++) {

            // county
            if (data[i].properties.COUNTYFP != bounds[j][0].county) {
                continue;
            }
           
            // tract
            if (data[i].properties.TRACTCE != bounds[j][0].tract) {
                continue;
            }

            results.push(data[i])
        } 
    }

    return results;
}

// zip codes
export const getZipCodes = async(tzBounds, state) => {
    let bounds = tzBounds
    let results = []
    state = state.toLowerCase()

    // get correct state
    const data = await getTradeZoneCartography(state, 'zip')

    for (let i=0; i < data.length; i++) {

        // check if matching bounds 
        for (let j = 0; j < bounds.length; j++) {

            // Block
            if (data[i].properties.ZCTA5CE10 != bounds[j][0]['zip-code-tabulation-area']) {
                continue;
            }

            results.push(data[i])
        } 
    }

    return results;
}

// zip codes
export const getDefaultZip = async (zip, state) => {
    let results = []
    state = state.toLowerCase()

    // get correct state
    const data = await getTradeZoneCartography(state, 'zip')
    for (let i=0; i < data.length; i++) {
        // Block
        if (data[i].properties.ZCTA5CE10 != zip) {
            continue;
        }
        results.push(data[i])

    }

    return results;
}