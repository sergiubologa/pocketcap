// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import './index.css'
import Header from './components/header/header'
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
      <Route path='/' component={App} />
    </div>
  </BrowserRouter>,
  rootElement)
registerServiceWorker()
