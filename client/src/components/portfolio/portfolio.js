// @flow
import React, { Component } from 'react'
import moment from 'moment'
import NewTransactionModal from '../new-transaction-modal/new-transaction-modal'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import type {Props} from '../../flow-types/react-generic'
import type {Portfolio as State} from '../../flow-types/portfolio'
import './portfolio.css'

class Portfolio extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = PortfolioStore.getPortfolio()
    this.updateStateData = this.updateStateData.bind(this)
    this.refreshCoinsData = this.refreshCoinsData.bind(this)
    this.openAddNewTransactionModal = this.openAddNewTransactionModal.bind(this)
  }

  componentWillMount() {
    PortfolioActions.fetchCoinsData()
    PortfolioStore.on('change', this.updateStateData)
  }

  componentWillUnmount() {
    PortfolioStore.removeListener('change', this.updateStateData)
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio())
  }

  refreshCoinsData = (): void => {
    PortfolioActions.fetchCoinsData()
  }

  openAddNewTransactionModal = (): void => {
    if (!this.state.isAddNewTransactionModalOpen) {
      PortfolioActions.toggleAddNewTransactionModal()
    }
  }

  getAddedAtDate = (): string => {
    return moment(this.state.coins.added_at).format("h:mm a");
  }

  render() {
    const newTransactionModal = this.state.isAddNewTransactionModalOpen ?
                                <NewTransactionModal /> :
                                ''
    return (
      <div>
        <p><i className="fa fa-calendar"></i>Last updated at: {this.getAddedAtDate()}</p>
        <button className="button is-primary" onClick={this.refreshCoinsData}>Refresh</button>
        <button className="button is-primary" onClick={this.openAddNewTransactionModal}>Add new transaction</button>
        <h1>Coins</h1>
        {this.state.coins.data.map(coin =>
          <div key={coin.id}><i className={`cc defaultCoinIcon ${coin.symbol.toUpperCase()}`}></i> {coin.id}: {coin.price_usd}</div>
        )}
        {newTransactionModal}
      </div>
    );
  }
}

export default Portfolio
