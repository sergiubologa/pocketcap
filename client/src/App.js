import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {users: []};

  componentDidMount() {
    console.log('fetch coins')
    return  fetch('/api/coins/cardano', {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
              console.log(res)
              return res.json();
            })
            .then(users => {
              console.log(users)
              this.setState({users})
            });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default App;
