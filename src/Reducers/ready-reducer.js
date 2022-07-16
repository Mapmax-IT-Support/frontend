import { UPDATE_READY } from '../Actions/ready-actions';

export default function readyReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_READY:
            return payload.ready;
        default:
            return state;
    }
}

