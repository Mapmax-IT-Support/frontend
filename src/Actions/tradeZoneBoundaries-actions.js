export const UPDATE_TRADEZONE_BOUNDS = 'tradeZone_bounds:updateTradeZoneBounds';

export function updateTradeZoneBounds(tradeZone_bounds) {
  return {
    type: UPDATE_TRADEZONE_BOUNDS,
    payload: {
      tradeZone_bounds: tradeZone_bounds
    }
  }
}
