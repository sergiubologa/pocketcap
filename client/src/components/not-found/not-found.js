// @flow
import React, { Component } from 'react'
import type { Props, State } from '../../flow-types/react-generic'
import './not-found.css'

class NotFound extends Component<Props, State> {
  render(){
    return (
      <h1>Page not fund</h1>
    )
  }
}

export default NotFound
