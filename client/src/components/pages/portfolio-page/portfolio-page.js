// @flow
import React, {Component} from 'react'
import DocumentTitle from 'react-document-title'
import Portfolio from '../../portfolio/portfolio'
import type {State, Props} from '../../../flow-types/react-generic'
import './portfolio-page.css'

export default class PortfolioPage extends Component<Props, State> {
  render() {
    return (
      <DocumentTitle title='Pocket Cap'>
        <div className="columns">
          <div className="column is-four-fifths">
            <Portfolio />
          </div>
          <div className="column">
            <h1 className="title">Stats</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id augue nec felis pellentesque imperdiet. Ut egestas, mauris ac congue scelerisque, dui dolor pharetra magna, at mollis nulla leo et lacus. Proin sit amet placerat elit. Suspendisse sed sapien vitae lectus ultricies volutpat. Praesent mattis nisl nibh, id efficitur tortor auctor a.</p>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
