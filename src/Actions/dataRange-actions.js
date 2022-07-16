export const UPDATE_DATA_RANGE = 'data_range:updateDataRange';

export function updateDataRange(type) {
    return {
      type: UPDATE_DATA_RANGE,
      payload: {
        data_range: type
      }
    }
}
