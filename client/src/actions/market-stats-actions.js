// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  FETCH_STATS_DATA: 'FETCH_STATS_DATA'
}

const Actions = {
  fetchStatsData: () => AppDispatcher.dispatch({
    type: Names.FETCH_STATS_DATA
  })
}

export {
  Actions,
  Names
}

export default Actions
