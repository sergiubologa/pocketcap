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
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Modal title</p>
            <button className="delete" aria-label="close" onClick={this.closeModal}></button>
          </header>
          <section className="modal-card-body">
            <p>Content.....</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success">Save changes</button>
            <button className="button" onClick={this.closeModal}>Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default NewTransactionModal
