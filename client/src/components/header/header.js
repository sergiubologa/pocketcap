// @flow
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faDonate from '@fortawesome/fontawesome-free-solid/faHandHoldingHeart'
import PortfolioStore from '../../stores/portfolio-store'
import DonateModal from '../donate-modal/donate-modal'
import DonateModalStore from '../../stores/donate-modal-store'
import {Actions as DonateModalActions} from '../../actions/donate-modal-actions'
import type {DonateModalState} from '../../flow-types/donate-modal'
import type { Props } from '../../flow-types/react-generic'
import logo from '../../resources/thepocketcap.png'
import './header.css'

type State = {
  isBurgerMenuVisible: boolean,
  homePageHash: ?string,
  isDonateModalOpen: boolean
}

class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isBurgerMenuVisible: false,
      homePageHash: PortfolioStore.getPortfolio().urlHash,
      isDonateModalOpen: DonateModalStore.isOpen()
    }
    this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);
    this.closeBurgerMenu = this.closeBurgerMenu.bind(this)
    this.toggleDonateModal = this.toggleDonateModal.bind(this)
    this.updateDonateModalState = this.updateDonateModalState.bind(this)
  }

  componentWillMount() {
    PortfolioStore.on('change', this.updateStateData)
    DonateModalStore.on('change', this.updateDonateModalState)
  }

  componentWillUnmount() {
    PortfolioStore.removeListener('change', this.updateStateData)
    DonateModalStore.removeListener('change', this.updateDonateModalState)
  }

  updateStateData = (): void => {
    this.setState({
      homePageHash: PortfolioStore.getPortfolio().urlHash
    })
  }

  updateDonateModalState = (changes: DonateModalState): void => {
    this.setState({isDonateModalOpen: changes.isOpen})
  }

  toggleBurgerMenu = (): void => {
    this.setState({isBurgerMenuVisible: !this.state.isBurgerMenuVisible})
  }

  closeBurgerMenu = (): void => {
    if (this.state.isBurgerMenuVisible) {
      this.setState({isBurgerMenuVisible: false})
    }
  }

  toggleDonateModal = (): void => {
    DonateModalActions.togleModalVisibility()
  }

  render(){
    const {isBurgerMenuVisible, homePageHash, isDonateModalOpen} = this.state
    const burgerMenuActiveClass = isBurgerMenuVisible ? 'is-active' : ''
    const homePageUrl = `/${homePageHash || ''}`

    // <div className="navbar-start">
    //   <Link to={homePageUrl} className="navbar-item" onClick={this.closeBurgerMenu}>Home</Link>
    //   <Link to="/about" className="navbar-item" onClick={this.closeBurgerMenu}>About</Link>
    //   <Link to="/contact" className="navbar-item" onClick={this.closeBurgerMenu}>Contact</Link>
    // </div>

    return (
      <nav className="navbar is-fixed-top is-light">

        <div className="navbar-brand">
          <Link to={homePageUrl} className="navbar-item">
            <img src={logo} alt="The Pocket Cap logo" height="28" />
          </Link>
          <div
            className={'navbar-burger ' + burgerMenuActiveClass}
            onClick={this.toggleBurgerMenu}>
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className={'navbar-menu ' + burgerMenuActiveClass}>
          <div className="navbar-end">
            <div className="navbar-item">
              <DonateModal isOpen={isDonateModalOpen} onCloseRequest={this.toggleDonateModal} />
              <button className="button is-primary" onClick={this.toggleDonateModal}>
                <span className="icon">
                  <FontAwesomeIcon icon={faDonate} />
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
