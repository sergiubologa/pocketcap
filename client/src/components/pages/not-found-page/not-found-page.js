// @flow
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import type { Props, State } from '../../../flow-types/react-generic'
import './not-found-page.css'

class NotFoundPage extends Component<Props, State> {
  render(){
    return (
      <DocumentTitle title='404 Not Found'>
        <div className="container-404">
          <div className="c">
              <div className="_404">404</div>
              <hr className="separator-404" />
              <div className="_1">THE PAGE</div>
              <div className="_2">WAS NOT FOUND</div>
              <Link to="/" className="btn-back-to-mars button is-primary is-inverted is-medium">BACK TO MARS</Link>
          </div>
          <div className="cloud x1"></div>
          <div className="cloud x1_5"></div>
          <div className="cloud x2"></div>
          <div className="cloud x3"></div>
          <div className="cloud x4"></div>
          <div className="cloud x5"></div>
        </div>
      </DocumentTitle>
    )
  }
}

export default NotFoundPage
