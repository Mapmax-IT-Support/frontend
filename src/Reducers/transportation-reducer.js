import { UPDATE_TRANSPORTATION } from '../Actions/transportation-actions';

export default function transportationReducer(state = '', {type, payload}) {
    
    switch (type) {
      
        case UPDATE_TRANSPORTATION:
            return payload.transportation;
        default:
            return state;
    }
}

