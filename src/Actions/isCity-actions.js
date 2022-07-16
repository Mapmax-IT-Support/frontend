export const UPDATE_IS_CITY = 'isCity:isCity';

export function updateIsCity(isCity) {
  return {
    type: UPDATE_IS_CITY,
    payload: {
      isCity: isCity
    }
  }
}
