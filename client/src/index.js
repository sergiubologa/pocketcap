// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'
import './index.css'
import Header from './components/header/header'
import NotFound from './components/not-found.js/not-found'
import Contact from './components/contact/contact'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const rootElement: ?HTMLElement = (document.getElementById('root'): ?HTMLElement)

if (rootElement == null) {
  throw new Error('Root element is missing!')
}

ReactDOM.render(
  <BrowserRouter>
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/contact' component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>,
  rootElement)
registerServiceWorker()
