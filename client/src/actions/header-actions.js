// @flow
import AppDispatcher from '../app-dispatcher'

const Names = {
  TOGGLE_BURGER_MENU: 'TOGGLE_BURGER_MENU'
}

const Actions = {
  toggleBurgerMenu: () => {
    AppDispatcher.dispatch({
      type: Names.TOGGLE_BURGER_MENU
    })
  }
}

export {
  Actions,
  Names
}

export default Actions
