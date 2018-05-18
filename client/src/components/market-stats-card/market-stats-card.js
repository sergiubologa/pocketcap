// @flow
import React, {Component} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown'
import CoinIcon from '../coin-icon/coin-icon'
import type {Props, State} from '../../flow-types/react-generic'
import './market-stats-card.css'

export default class MarketStatsCard extends Component<Props, State> {
  render() {
    return (
      <div className="card market-stats-card">

        <div className="card-content">
          <p className="title">Market Stats</p>
          <p className="subtitle is-6">last updated: 3 min ago</p>

          <div className="content">
            <div className="columns is-multiline is-gapless">
              <div className="column is-half">Market cap:</div>
              <div className="column is-half">$406,261,033,537</div>
              <div className="column is-half">Volume 24h:</div>
              <div className="column is-half">$19,567,666,806</div>
              <div className="column is-half">BTC dominance:</div>
              <div className="column is-half">34.65%</div>
            </div>
          </div>
        </div>
        <div>

          <p className="is-size-7 has-text-weight-semibold is-marginless has-text-centered has-text-grey">
            <FontAwesomeIcon icon={faAngleDown} />&nbsp;
            <span>best performers in the last 24 hrs</span>&nbsp;
            <FontAwesomeIcon icon={faAngleDown} />
          </p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={'BTC'} /> BTC</div>
            <div className="has-text-green">24%</div>
          </div>
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={'FUN'} /> FUN</div>
            <div className="has-text-green">16%</div>
          </div>
          <div className="card-footer-item has-text-centered">
            <div><CoinIcon symbol={'ADA'} /> ADA</div>
            <div className="has-text-green">13%</div>
          </div>
        </footer>

      </div>
    )
  }
}
