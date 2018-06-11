// @flow
import EventEmitter from 'events'
import AppDispatcher from '../app-dispatcher'
import {Names as DonateModalActionsNames} from '../actions/donate-modal-actions'
import type {DonateModalState} from '../flow-types/donate-modal'

class DonateModalStore extends EventEmitter {
  modal: DonateModalState = {
    isOpen: false
  }

  toggleDonateModal() {
    this.modal.isOpen = !this.modal.isOpen
    this.emit('change', this.modal)
  }

  isOpen() {
    return this.modal.isOpen
  }

  handleActions(action) {
    switch (action.type) {
      case DonateModalActionsNames.TOGGLE_MODAL_VISIBILITY:
        this.toggleDonateModal()
        break
      default:
        break
    }
  }
}

const donateModalStore = new DonateModalStore()
AppDispatcher.register(donateModalStore.handleActions.bind(donateModalStore))

export default donateModalStore
