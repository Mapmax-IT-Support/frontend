export const CLEAR_DATA = 'state:clearData';

export function clearData(data) {
  return {
    type: CLEAR_DATA,
    payload: {
      data: data
    }
  }
}
