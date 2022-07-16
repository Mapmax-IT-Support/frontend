import { showError } from '../Actions/user-actions'
import { API } from '../Constants'

export async function getSubwayTotals(coords) {

    var formBody = {
        'coords': coords,
    };
    
    return fetch(API + 'subways/totals',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => {
            return response.json()
        })
        .catch(error => {
            showError()
            console.error('Subway Error:', error)
        })
}


export async function getSubwayLines(lines) {

    var formBody = {
        'lines': lines,
    };
    
    return fetch(API + 'subways/lines',
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
            console.error('Subway Error:', error)
        })
}

