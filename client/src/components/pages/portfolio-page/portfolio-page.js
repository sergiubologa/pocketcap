// @flow
import React, {Component} from 'react'
import Portfolio from '../../portfolio/portfolio'
import type {Props, State} from '../../../flow-types/react-generic'
import './portfolio-page.css'

export default class PortfolioPage extends Component<Props, State> {
  render() {
    return (
      <div className="portfolio-page">
        <Portfolio />
      </div>
    )
  }
}
