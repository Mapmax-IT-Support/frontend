import { UPDATE_DATA_RANGE } from '../Actions/dataRange-actions';

export default function dataRangeReducer(state = { }, {type, payload}) {
    
    switch (type) {
       
        case UPDATE_DATA_RANGE:
            return payload.data_range;
        default:
            return state;
    }
}
