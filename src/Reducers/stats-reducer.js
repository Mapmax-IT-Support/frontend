import { UPDATE_STATS, UPDATE_STATS_ZIP,  UPDATE_STATS_TZ } from '../Actions/stats-actions';

export default function statsReducer(state = { tradezone: {}, zip: {} } , {type, payload}) {
    
    switch (type) {
       
        case UPDATE_STATS:
            return payload.data;

        case UPDATE_STATS_ZIP:
            return {...state, zip: payload.data }

        case UPDATE_STATS_TZ:
            return {...state, tradezone: payload.data }

        default:
            return state;
    }
}