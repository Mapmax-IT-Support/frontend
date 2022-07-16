export const UPDATE_GEO_UNIT = 'geo_unit:updateGeoUnit';

export function updateGeoUnit(type) {
    return {
      type: UPDATE_GEO_UNIT,
      payload: {
        geo_unit: type
      }
    }
}
