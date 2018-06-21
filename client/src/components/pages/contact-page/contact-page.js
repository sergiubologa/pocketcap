// @flow
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import type { Props, State } from '../../../flow-types/react-generic'
import './contact-page.css'

class ContactPage extends Component<Props, State> {
  render(){
    return (
      <DocumentTitle title='Contact'>
        <h1>Contact page</h1>
      </DocumentTitle>
    )
  }
}

export default ContactPage
