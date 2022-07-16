export const UPDATE_STATS = 'updateStats';
export const UPDATE_STATS_ZIP = 'updateStatsZip';
export const UPDATE_STATS_TZ = 'updateStatsTZ';

export function updateStats(data) {
  return {
    type: UPDATE_STATS,
    payload: { data }
  }
}

export function updateStatsZip(data) {
  return {
    type: UPDATE_STATS_ZIP,
    payload: { data }
  }
}


export function updateStatsTradezone(data) {
  return {
    type: UPDATE_STATS_TZ,
    payload: { data }
  }
}
