export const UPDATE_TRACT = 'tract:updateTract';

export function updateTract(tract) {
  return {
    type: UPDATE_TRACT,
    payload: {
      tract: tract
    }
  }
}
