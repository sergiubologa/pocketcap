// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootElement: ?HTMLElement = (document.getElementById('root'): ?HTMLElement);

if (rootElement == null) {
  throw new Error('Root element is missing!');
}

ReactDOM.render(<App />, rootElement);
registerServiceWorker();
