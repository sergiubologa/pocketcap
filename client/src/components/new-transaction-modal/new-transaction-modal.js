// @flow
import React, { Component } from 'react'
import PortfolioActions from '../../actions/portfolio-actions'
type State = {}
type Props = {}

class NewTransactionModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal = (): void => {
    PortfolioActions.toggleAddNewTransactionModal()
  }

  render() {
    return (
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Modal title</p>
            <button class="delete" aria-label="close" onClick={this.closeModal}></button>
          </header>
          <section class="modal-card-body">
            <p>Content.....</p>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success">Save changes</button>
            <button class="button" onClick={this.closeModal}>Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default NewTransactionModal
