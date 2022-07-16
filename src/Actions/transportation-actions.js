export const UPDATE_TRANSPORTATION = 'transportation:updateTransportation';

export function updateTransportation(transportation) {
    return {
        type: UPDATE_TRANSPORTATION,
        payload: {
            transportation: transportation
        }
    }
}

