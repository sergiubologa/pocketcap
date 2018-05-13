// @flow
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import type { Props, State } from '../../../flow-types/react-generic'
import './about-page.css'

class AboutPage extends Component<Props, State> {
  render(){
    return (
      <DocumentTitle title='About'>
        <h1>Abbout page</h1>
      </DocumentTitle>
    )
  }
}

export default AboutPage
