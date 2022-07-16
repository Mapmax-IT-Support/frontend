import { UPDATE_ZIP } from '../Actions/zip-actions';

export default function zipReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_ZIP:
            return payload.zip;
        default:
            return state;
    }
}