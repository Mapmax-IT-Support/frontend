
export const UPDATE_PLACES = 'places:updatePlaces';
const KEY='28a04efd887ab5cf335f99aabcde1978452de2cf';

export function updatePlaces(newPlaces) {
    return {
      type: UPDATE_PLACES,
      payload: {
        places: newPlaces
      }
    }
}
