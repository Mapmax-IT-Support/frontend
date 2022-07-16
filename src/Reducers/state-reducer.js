import { UPDATE_STATE } from '../Actions/state-actions';

export default function stateReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_STATE:
            return payload.state;
        default:
            return state;
    }
}