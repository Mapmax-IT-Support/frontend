import { UPDATE_TRACT } from '../Actions/tract-actions';

export default function tractReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_TRACT:
            return payload.tract;
        default:
            return state;
    }
}