// @flow
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import type { Props } from '../../flow-types/react-generic'
import type { HeaderData as State } from '../../flow-types/header-data'
import HeaderStore from '../../stores/header-store'
import HeaderActions from '../../actions/header-actions'
import logo from '../../resources/thepocketcap.png'
import './header.css'

class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = HeaderStore.getHeaderState()
  }

  componentWillMount() {
    HeaderStore.on('change', this.getHeaderState)
  }

  componentWillUnmount() {
    HeaderStore.removeListener('change', this.getHeaderState)
  }

  getHeaderState = (): void => {
    this.setState(HeaderStore.getHeaderState())
  }

  toggleBurgerMenu = (): void => {
    HeaderActions.toggleBurgerMenu()
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
            onClick={this.toggleBurgerMenu.bind(this)}>
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className={'navbar-menu ' + burgerMenuActiveClass}>
          <div className="navbar-start">
            <Link to="/" className="navbar-item">Home</Link>
            <Link to="/contact" className="navbar-item">Contact</Link>
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
