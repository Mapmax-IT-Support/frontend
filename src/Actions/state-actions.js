export const UPDATE_STATE = 'state:updateState';

export function updateState(state) {
  return {
    type: UPDATE_STATE,
    payload: {
      state: state
    }
  }
}
