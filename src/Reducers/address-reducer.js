import { UPDATE_ADDRESS } from '../Actions/address-actions';

export default function addressReducer(state = '', {type, payload}) {
    
    switch (type) {
       
        case UPDATE_ADDRESS:
            return payload.address;
        default:
            return state;
    }
}