// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import AppRoot from './components/app-root'
import registerServiceWorker from './registerServiceWorker'

const rootElement: ?HTMLElement = (document.getElementById('root'): ?HTMLElement)

if (rootElement == null) {
  throw new Error('Root element is missing!')
}

ReactDOM.render(<AppRoot />, rootElement)
registerServiceWorker()
