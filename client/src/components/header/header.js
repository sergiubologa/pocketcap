// @flow
import React, { Component } from 'react'
import type { Props, State } from '../../flow-types/react-generic'
import logo from '../../resources/logo.svg'
import './header.css'

class Header extends Component<Props, State> {
  render(){
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to ThePocketCap</h1>
      </header>
    )
  }
}

export default Header
