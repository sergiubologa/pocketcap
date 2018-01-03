// @flow
import React, { Component } from 'react';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';

type Coin = {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  price_usd: number,
  price_btc: number,
  "24h_volume_usd": number,
  market_cap_usd: number,
  available_supply: number,
  total_supply: number,
  max_supply: number,
  percent_change_1h: number,
  percent_change_24h: number,
  percent_change_7d: number,
  last_updated: number
};

type Props = {};

type State = {
  coins: { added_at: ?Date, data: Array<Coin> }
};

class App extends Component<Props, State> {
  state = {
    coins: { added_at: undefined, data: [] }
  };

  componentDidMount() {
    console.log('fetch coins')
    fetch('/api/coins', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(coins => {
      console.log(coins)
      this.setState({coins})
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getAddedAtDate() {
    return moment(this.state.coins.added_at).format("h:mm a");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ThePocketCap</h1>
        </header>
        <p className="App-intro">Last updated at: {this.getAddedAtDate()}</p>
        <h1>Coins</h1>
        {this.state.coins.data.map(coin =>
          <div key={coin.id}>{coin.id}: {coin.price_usd}</div>
        )}
      </div>
    );
  }
}

export default App;
