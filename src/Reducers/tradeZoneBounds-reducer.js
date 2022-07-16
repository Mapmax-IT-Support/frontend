import { UPDATE_TRADEZONE_BOUNDS } from '../Actions/tradeZoneBoundaries-actions';

export default function tradeZoneBoundsReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_TRADEZONE_BOUNDS:
            return payload.tradeZone_bounds;
        default:
            return state;
    }
}