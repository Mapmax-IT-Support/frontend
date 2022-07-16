export const UPDATE_ZIP = 'zip:updateZip';

export function updateZip(zip) {
  return {
    type: UPDATE_ZIP,
    payload: {
      zip: zip
    }
  }
}
