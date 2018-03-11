// @flow
import React, { Component } from 'react'
import type { Props, State } from '../flow-types/react-generic'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './header/header'
import Portfolio from './portfolio/portfolio'
import Contact from './contact/contact'
import NotFound from './not-found/not-found'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css'
import './app-root.css'

class AppRoot extends Component<Props, State> {
  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path='/' component={Portfolio} />
            <Route path='/contact' component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default AppRoot
