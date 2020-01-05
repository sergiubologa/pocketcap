// @flow
import React, { Component, Fragment } from "react";
import type { Props } from "../flow-types/react-generic";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./header/header";
import Footer from "./footer/footer";
import PortfolioPage from "./pages/portfolio-page/portfolio-page";
import AboutPage from "./pages/about-page/about-page";
import ContactPage from "./pages/contact-page/contact-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import "bulma/css/bulma.css";
import "crypto-vect-icons/webfont/cryptocoins.css";
import "crypto-vect-icons/webfont/cryptocoins-colors.css";
import "./app-root.css";
import * as Utils from "../utils/utils";

type State = {
  showDeviceWarning: boolean
};

const DEVICE_WARNING_KEY = "DEVICE_WARNING";

class AppRoot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const hasDeviceWarningKey = !!localStorage.getItem(DEVICE_WARNING_KEY);
    const showDeviceWarning =
      (!hasDeviceWarningKey && Utils.isSmall()) || Utils.isMedium();
    this.state = {
      showDeviceWarning
    };
  }

  onCloseDeviceWarning = () => {
    this.setState({
      showDeviceWarning: false
    });
    localStorage.setItem(DEVICE_WARNING_KEY, "true");
  };

  render() {
    const { showDeviceWarning } = this.state;

    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          {showDeviceWarning && (
            <div className="notification is-warning">
              <button
                className="delete"
                onClick={this.onCloseDeviceWarning}
              ></button>
              For the best experience please use a device with a wider screen
              (e.g. laptop, PC)
            </div>
          )}
          <div id="page-content">
            <Switch>
              <Route exact path="/" component={PortfolioPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default AppRoot;
