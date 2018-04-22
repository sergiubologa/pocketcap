// @flow
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import type { Props, State } from '../../../flow-types/react-generic'
import './not-found-page.css'

class NotFoundPage extends Component<Props, State> {
  render(){
    return (
      <DocumentTitle title='404 Not Found'>
        <h1>Page not found</h1>
      </DocumentTitle>
    )
  }
}

export default NotFoundPage
