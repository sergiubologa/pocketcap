// @flow
import React, {Component} from 'react'
import CoinIcon from '../../../elements/coin-icon/coin-icon'
import TabContent from '../tab-content/tab-content'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPaypal from '@fortawesome/fontawesome-free-brands/faPaypal'
import TextToClipboard from '../../../elements/text-to-clipboard/text-to-clipboard'
import btcQrCode from '../../../../resources/qr/btc.png'
import ethQrCode from '../../../../resources/qr/eth.png'
import ltcQrCode from '../../../../resources/qr/ltc.png'
import bchQrCode from '../../../../resources/qr/bch.png'
import type {Props} from '../../../../flow-types/react-generic'
import './tabs.css'
type State = {
  activeTab: string
}

export default class Tabs extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      activeTab: "BTC"
    }
    this.changeTab = this.changeTab.bind(this)
  }

  changeTab = (tabName: string): void => {
    if (this.state.activeTab !== tabName) {
      this.setState({activeTab: tabName})
    }
  }

  render() {
    const {activeTab} = this.state

    return (
      <div className="tabs-container">
        <div className="tabs is-fullwidth is-small">
          <ul>
            <li className={activeTab === "BTC" ? "is-active" : ""}>
              <a onClick={() => this.changeTab("BTC")}><CoinIcon symbol="BTC" />&nbsp;<span>BTC</span></a>
            </li>
            <li className={activeTab === "LTC" ? "is-active" : ""}>
              <a onClick={() => this.changeTab("LTC")}><CoinIcon symbol="LTC" />&nbsp;<span>LTC</span></a>
            </li>
            <li className={activeTab === "ETH" ? "is-active" : ""}>
              <a onClick={() => this.changeTab("ETH")}><CoinIcon symbol="ETH" />&nbsp;<span>ETH</span></a>
            </li>
            <li className={activeTab === "BCH" ? "is-active" : ""}>
              <a onClick={() => this.changeTab("BCH")}><CoinIcon symbol="BCH" />&nbsp;<span>BCH</span></a>
            </li>
            <li className={activeTab === "Paypal" ? "is-active" : ""}>
              <a onClick={() => this.changeTab("Paypal")}>
                <span className="icon is-small has-text-info"><FontAwesomeIcon icon={faPaypal} /></span>
                <span>PayPal</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tabs-content content">
          <TabContent isVisible={activeTab === "BTC"}>
            <h4 className="has-text-grey"><CoinIcon symbol="BTC" />&nbsp;Bitcoin Wallet</h4>
            <TextToClipboard text="1ERogFEqNQbCSfoLgs135e52CBD8sU956g" />
            <figure className="image is-128x128">
              <img src={btcQrCode} alt="Bitcoin Address" />
            </figure>
          </TabContent>
          <TabContent isVisible={activeTab === "LTC"}>
            <h4 className="has-text-grey"><CoinIcon symbol="LTC" />&nbsp;Litecoin Wallet</h4>
            <TextToClipboard text="LhkbWcdwQK2UV7B6ktbt2x1w4djMR6AnNV" />
            <figure className="image is-128x128">
              <img src={ltcQrCode} alt="Litecoin Address" />
            </figure>
          </TabContent>
          <TabContent isVisible={activeTab === "ETH"}>
            <h4 className="has-text-grey"><CoinIcon symbol="ETH" />&nbsp;Ethereum Wallet</h4>
            <TextToClipboard text="0xb2aE412C44faE0651B3b8083c4eFBC47A9DE01A8" />
            <figure className="image is-128x128">
              <img src={ethQrCode} alt="Ethereum Address" />
            </figure>
          </TabContent>
          <TabContent isVisible={activeTab === "BCH"}>
            <h4 className="has-text-grey"><CoinIcon symbol="BCH" />&nbsp;Bitcoin Cash Wallet</h4>
            <TextToClipboard text="19vFs3HmLjChnYm1G99CRumtBjY6ucXf8F" />
            <figure className="image is-128x128">
              <img src={bchQrCode} alt="Bitcoin Cash Address" />
            </figure>
          </TabContent>
          <TabContent isVisible={activeTab === "Paypal"}>
            <h4 className="has-text-grey"><FontAwesomeIcon icon={faPaypal} className="has-text-info" />&nbsp;PayPal</h4>
            <a href="https://PayPal.Me/sbologa" target="_blank" rel="noopener noreferrer" className="button is-medium is-warning">Donate on PayPal</a>
          </TabContent>
        </div>
      </div>
    )
  }
}
