// @flow
import React, { Component } from 'react'
import type {Props} from '../flow-types/react-generic'
import type {Coin} from '../flow-types/coins'
import moment from 'moment'
import './App.css'

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
      <div>
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
