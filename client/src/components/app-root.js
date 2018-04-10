// @flow
import React, { Component, Fragment } from 'react'
import type { Props, State } from '../flow-types/react-generic'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './header/header'
import PortfolioPage from './pages/portfolio-page/portfolio-page'
import ContactPage from './pages/contact-page/contact-page'
import NotFoundPage from './pages/not-found-page/not-found-page'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'
import 'cryptocoins-icons/webfont/cryptocoins-colors.css'
import './app-root.css'

class AppRoot extends Component<Props, State> {
  render(){
    return (
      <BrowserRouter>
        <Fragment>
          <Header />
          <Switch>
            <Route exact path='/' component={PortfolioPage} />
            <Route path='/contact' component={ContactPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    )
  }
}

export default AppRoot
