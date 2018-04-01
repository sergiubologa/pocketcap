// @flow
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import type { Props } from '../../flow-types/react-generic'
import logo from '../../resources/thepocketcap.png'
import './header.css'

type State = {
  isBurgerMenuVisible: boolean
}

class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isBurgerMenuVisible: false
    }
    this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);
    this.closeBurgerMenu = this.closeBurgerMenu.bind(this)
  }

  toggleBurgerMenu = (): void => {
    this.setState({isBurgerMenuVisible: !this.state.isBurgerMenuVisible})
  }

  closeBurgerMenu = (): void => {
    if (this.state.isBurgerMenuVisible) {
      this.setState({isBurgerMenuVisible: false})
    }
  }

  render(){
    const burgerMenuActiveClass = this.state.isBurgerMenuVisible ? 'is-active' : ''

    return (
      <nav className="navbar is-fixed-top is-light">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src={logo} alt="The Pocket Cap logo" height="28" />
          </Link>
          <div
            className={'navbar-burger ' + burgerMenuActiveClass}
            onClick={this.toggleBurgerMenu}>
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className={'navbar-menu ' + burgerMenuActiveClass}>
          <div className="navbar-start">
            <Link to="/" className="navbar-item" onClick={this.closeBurgerMenu}>Home</Link>
            <Link to="/contact" className="navbar-item" onClick={this.closeBurgerMenu}>Contact</Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <button className="button is-primary">
                <span className="icon">
                  <i className="fa fa-heart-o"></i>
                </span>
                <span>Donate!</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
