export const UPDATE_READY = 'state:updateReady';

export function updateReady(isReady) {
  return {
    type: UPDATE_READY,
    payload: {
      ready: isReady
    }
  }
}
