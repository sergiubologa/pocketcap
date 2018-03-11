// @flow
import React, { Component } from 'react'
import type {Props} from '../../flow-types/react-generic'
import type {CoinsData as State} from '../../flow-types/coins'
import moment from 'moment'
import CoinsStore from '../../stores/coins-store'
import CoinsActions from '../../actions/coins-actions'
import './portfolio.css'

class Portfolio extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = CoinsStore.getCoinsData()
    this.getCoinsData = this.getCoinsData.bind(this)
  }

  componentWillMount() {
    CoinsActions.fetchCoinsData()
    CoinsStore.on('change', this.getCoinsData)
  }

  componentWillUnmount() {
    CoinsStore.removeListener('change', this.getCoinsData)
  }

  getCoinsData = (): void => {
    this.setState(CoinsStore.getCoinsData())
  }

  refreshCoinsData = (): void => {
    CoinsActions.fetchCoinsData()
  }

  getAddedAtDate = (): string => {
    return moment(this.state.coins.added_at).format("h:mm a");
  }

  render() {
    return (
      <div>
        <p className="App-intro">
          <i className="fa fa-calendar"></i>Last updated at: {this.getAddedAtDate()}</p>
        <button className="button is-primary" onClick={this.refreshCoinsData.bind(this)}>Refresh</button>
        <h1>Coins</h1>
        {this.state.coins.data.map(coin =>
          <div key={coin.id}><i className={`cc ${coin.symbol.toUpperCase()}`}></i> {coin.id}: {coin.price_usd}</div>
        )}
      </div>
    );
  }
}

export default Portfolio
