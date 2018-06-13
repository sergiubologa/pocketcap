// @flow
import React from 'react'
import Modal from '../elements/modal/modal'
import Tabs from './components/tabs/tabs'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter'
import faReddit from '@fortawesome/fontawesome-free-brands/faReddit'
import faDonate from '@fortawesome/fontawesome-free-solid/faHandHoldingHeart'
type Props = {
  isOpen: boolean,
  onCloseRequest: () => void
}

export default (props: Props) => {
  return (
    <Modal title="Make a donation" alignFooter="right" {...props}>
      <div className="columns">
        <div className="column is-one-third content">
          <FontAwesomeIcon icon={faDonate} size="6x" className="has-text-grey-lighter" />
          <br /><br />
          <p className="has-text-grey-dark">
            PocketCap is an <a href="https://github.com/sergiubologa/thepocketcap" rel="noreferrer noopener" target="_blank">open source</a> project and needs your support.
          </p>
          <h6>Spread the word!</h6>
          <p className="buttons">
            <a className="button is-small">
              <span className="icon">
                <FontAwesomeIcon icon={faTwitter} />
              </span>
              <span>Twitter</span>
            </a>
            <a className="button is-small">
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
