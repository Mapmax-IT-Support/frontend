export const ACTIVATE_PLACE = 'active_place:activatePlace';

export function updateActivePlace(place) {
  return {
    type: ACTIVATE_PLACE,
    payload: {
      active_place: place
    }
  }
}
