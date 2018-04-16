// @flow
import React, {Component} from 'react'
import QueryString from 'query-string'
import Portfolio from '../../portfolio/portfolio'
import type {State} from '../../../flow-types/react-generic'
import './portfolio-page.css'

type Props = {
  location: Object
}

export default class PortfolioPage extends Component<Props, State> {
  render() {
    console.log(QueryString.parse(this.props.location.search))
    return (
      <div className="portfolio-page">
        <Portfolio />
      </div>
    )
  }
}
