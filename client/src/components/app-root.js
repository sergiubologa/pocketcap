// @flow
import React, { Component, Fragment } from 'react'
import type { Props, State } from '../flow-types/react-generic'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './header/header'
import Footer from './footer/footer'
import PortfolioPage from './pages/portfolio-page/portfolio-page'
import AboutPage from './pages/about-page/about-page'
import ContactPage from './pages/contact-page/contact-page'
import NotFoundPage from './pages/not-found-page/not-found-page'
import 'bulma/css/bulma.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'
import 'cryptocoins-icons/webfont/cryptocoins-colors.css'
import './app-root.css'

class AppRoot extends Component<Props, State> {
  render(){
    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          <div id="page-content">
            <Switch>
              <Route exact path='/' component={PortfolioPage} />
              <Route path='/about' component={AboutPage} />
              <Route path='/contact' component={ContactPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
          <Footer />
        </Fragment>
      </BrowserRouter>
    )
  }
}

export default AppRoot
