// @flow
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import PortfolioStore from "../../stores/portfolio-store";
import DonateModal from "../donate-modal/donate-modal";
import DonateModalStore from "../../stores/donate-modal-store";
import { Actions as DonateModalActions } from "../../actions/donate-modal-actions";
import type { DonateModalState } from "../../flow-types/donate-modal";
import type { Props } from "../../flow-types/react-generic";
import Icon from "../elements/icon/icon";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import logo from "../../resources/pocketcap@4x.png";
import "./header.css";

type State = {
  isBurgerMenuVisible: boolean,
  homePageHash: ?string,
  isDonateModalOpen: boolean
};

class Header extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isBurgerMenuVisible: false,
      homePageHash: PortfolioStore.getPortfolio().urlHash,
      isDonateModalOpen: DonateModalStore.isOpen()
    };
    this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);
    this.closeBurgerMenu = this.closeBurgerMenu.bind(this);
    this.toggleDonateModal = this.toggleDonateModal.bind(this);
    this.updateDonateModalState = this.updateDonateModalState.bind(this);
  }

  componentDidMount() {
    PortfolioStore.on("change", this.updateStateData);
    DonateModalStore.on("change", this.updateDonateModalState);
  }

  componentWillUnmount() {
    PortfolioStore.removeListener("change", this.updateStateData);
    DonateModalStore.removeListener("change", this.updateDonateModalState);
  }

  updateStateData = (): void => {
    this.setState({
      homePageHash: PortfolioStore.getPortfolio().urlHash
    });
  };

  updateDonateModalState = (changes: DonateModalState): void => {
    this.setState({ isDonateModalOpen: changes.isOpen });
  };

  toggleBurgerMenu = (): void => {
    this.setState({ isBurgerMenuVisible: !this.state.isBurgerMenuVisible });
  };

  closeBurgerMenu = (): void => {
    if (this.state.isBurgerMenuVisible) {
      this.setState({ isBurgerMenuVisible: false });
    }
  };

  toggleDonateModal = (): void => {
    DonateModalActions.togleModalVisibility();
  };

  render() {
    const { homePageHash, isDonateModalOpen } = this.state;
    // const burgerMenuActiveClass = isBurgerMenuVisible ? "is-active" : "";
    const homePageUrl = `/${homePageHash || ""}`;

    return (
      <nav className="navbar is-fixed-top is-light">
        <div className="navbar-brand">
          <Link to={homePageUrl} className="navbar-item">
            <img src={logo} alt="The Pocket Cap logo" height="28" />
          </Link>
          <a
            className="navbar-item"
            href="https://github.com/sergiubologa/thepocketcap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <Icon icon={faGithub} />
            </span>
          </a>
          <a
            className="navbar-item"
            href="https://twitter.com/CapPocket"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <Icon icon={faTwitter} />
            </span>
          </a>
          {/* <div
            className={"navbar-burger " + burgerMenuActiveClass}
            onClick={this.toggleBurgerMenu}
          >
            <span />
            <span />
            <span />
          </div> */}
        </div>

        {/* <div className="navbar-start">
          <Link
            to={homePageUrl}
            className="navbar-item"
            onClick={this.closeBurgerMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="navbar-item"
            onClick={this.closeBurgerMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="navbar-item"
            onClick={this.closeBurgerMenu}
          >
            Contact
          </Link>
        </div> */}

        {/* <div className={"navbar-menu " + burgerMenuActiveClass}>
          <div className="navbar-end">
            <div className="navbar-item">
              <button
                className="button is-primary"
                onClick={this.toggleDonateModal}
              >
                <span className="icon">
                  <Icon icon={faHandHoldingHeart} />
                </span>
                <span>Get involved!</span>
              </button>
            </div>
          </div>
        </div> */}

        <DonateModal
          isOpen={isDonateModalOpen}
          onCloseRequest={this.toggleDonateModal}
        />
      </nav>
    );
  }
}

export default Header;
