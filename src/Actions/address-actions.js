export const UPDATE_ADDRESS = 'address:updateAddress';

export function updateAddress(newAddress) {
    return {
      type: UPDATE_ADDRESS,
      payload: {
        address: newAddress
      }
    }
}
