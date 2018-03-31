// @flow
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as HeaderActionsNames} from '../actions/header-actions'
import type {HeaderData} from '../flow-types/header-data'

class HeaderStore extends EventEmitter {
  headerData: HeaderData = {
    isBurgerMenuVisible: false
  }

  toggleBurgerMenu() {
    this.headerData = {
      ...this.headerData,
      isBurgerMenuVisible: !this.headerData.isBurgerMenuVisible
    }
    this.emit('change')
  }

  getHeaderState(): HeaderData {
    return this.headerData
  }

  handleActions(action) {
    switch (action.type) {
      case HeaderActionsNames.TOGGLE_BURGER_MENU:
        this.toggleBurgerMenu()
        break
      default:
        break
    }
  }
}

const headerStore = new HeaderStore()
AppDispatcher.register(headerStore.handleActions.bind(headerStore))

export default headerStore
