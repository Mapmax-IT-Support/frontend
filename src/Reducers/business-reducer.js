import { UPDATE_BUSINESS_TYPE } from '../Actions/business-actions';

export default function businessReducer(state = {type: '', priceLevel: 1}, {type, payload}) {
    
    switch (type) {
       
        case UPDATE_BUSINESS_TYPE:
            return payload.business_type;
        default:
            return state;
    }
}
