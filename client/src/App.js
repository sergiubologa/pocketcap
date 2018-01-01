import React, { Component } from 'react';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {coins: {added_at: new Date().toString(), data: []}};

  componentDidMount() {
    console.log('fetch coins')
    // fetch('/api/coins', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => {
    //   console.log(res)
    //   return res.json();
    // })
    // .then(coins => {
    //   console.log(coins)
    //   this.setState({coins})
    // });
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
