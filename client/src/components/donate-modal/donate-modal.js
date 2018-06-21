// @flow
import React from 'react'
import Modal from '../elements/modal/modal'
import Tabs from './components/tabs/tabs'
import LinkNewWindow from '../elements/link-new-window/link-new-window'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faReddit } from '@fortawesome/free-brands-svg-icons'
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons'
type Props = {
  isOpen: boolean,
  onCloseRequest: () => void
}

export default (props: Props) => {
  return (
    <Modal title="Make a donation" alignFooter="right" {...props}>
      <div className="columns">
        <div className="column is-one-third content">
          <FontAwesomeIcon icon={faHandHoldingHeart} size="6x" className="has-text-grey-lighter" />
          <br /><br />
          <p className="has-text-grey-dark">
            PocketCap is an <a href="https://github.com/sergiubologa/thepocketcap" rel="noreferrer noopener" target="_blank">open source</a> project and needs your support.
          </p>
          <h6>Spread the word!</h6>
          <p className="buttons">
            <LinkNewWindow className="button is-small" url="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.pocketcap.com%2F&text=Keep%20track%20of%20your%20crypto%20currencies%20using%20PocketCap.%20No%20account%20needed,%20it%27s%20completely%20anonymous%20and%20open%20source.%20Check%20it%20out%3A&via=pocketcap">
              <span className="icon">
                <FontAwesomeIcon icon={faTwitter} />
              </span>
              <span>Twitter</span>
            </LinkNewWindow>
            <a className="button is-small" target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/submit?url=https%3A%2F%2Fwww.pocketcap.com%2F&title=PocketCap%20-%20Keep%20track%20of%20your%20crypto%20profitability">
              <span className="icon">
                <FontAwesomeIcon icon={faReddit} />
              </span>
              <span>Reddit</span>
            </a>
          </p>
        </div>
        <div className="column">
          <Tabs />
        </div>
      </div>
    </Modal>
  )
}
