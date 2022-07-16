import { UPDATE_IS_CITY } from '../Actions/isCity-actions';

export default function isCityReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_IS_CITY:
            return payload.isCity;
        default:
            return state;
    }
}

