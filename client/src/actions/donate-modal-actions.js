// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  TOGGLE_MODAL_VISIBILITY: 'TOGGLE_MODAL_VISIBILITY'
}

const Actions = {
  togleModalVisibility: () => AppDispatcher.dispatch({
    type: Names.TOGGLE_MODAL_VISIBILITY
  })
}

export {
  Actions,
  Names
}

export default Actions
