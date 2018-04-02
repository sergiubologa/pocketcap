// @flow
import React, { Component } from 'react'
import type {Props} from '../../flow-types/react-generic'
import type {CoinsData as State} from '../../flow-types/coins'
import moment from 'moment'
import PortfolioStore from '../../stores/portfolio-store'
import PortfolioActions from '../../actions/portfolio-actions'
import './portfolio.css'

class Portfolio extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = PortfolioStore.getCoinsData()
    this.getCoinsData = this.getCoinsData.bind(this)
  }

  componentWillMount() {
    PortfolioActions.fetchCoinsData()
    PortfolioStore.on('change', this.getCoinsData)
  }

  componentWillUnmount() {
    PortfolioStore.removeListener('change', this.getCoinsData)
  }

  getCoinsData = (): void => {
    this.setState(PortfolioStore.getCoinsData())
  }

  refreshCoinsData = (): void => {
    PortfolioActions.fetchCoinsData()
  }

  getAddedAtDate = (): string => {
    return moment(this.state.coins.added_at).format("h:mm a");
  }

  render() {
    return (
      <div>
        <p><i className="fa fa-calendar"></i>Last updated at: {this.getAddedAtDate()}</p>
        <button className="button is-primary" onClick={this.refreshCoinsData.bind(this)}>Refresh</button>
        <h1>Coins</h1>
        {this.state.coins.data.map(coin =>
          <div key={coin.id}><i className={`cc defaultCoinIcon ${coin.symbol.toUpperCase()}`}></i> {coin.id}: {coin.price_usd}</div>
        )}
      </div>
    );
  }
}

export default Portfolio
