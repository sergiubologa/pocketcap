// @flow
import React from 'react'
import Icon from '../../../elements/icon/icon'
import { faPlus, faUserSlash, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './no-transactions.css'

type Props = {
  onAddNewTransaction: () => void
}

export default (props: Props) => {
  return (
    <div className="noTransactionsContainer has-text-centered">
      <h1 className="title has-text-weight-light">Keep track of your investments in crypto currencies</h1>
      <p className="has-text-weight-light is-size-5">
        Add your transactions and bookmark the generated URL
      </p>
      <p className="strenghts has-text-weight-light">
        <span className="has-text-grey">
          <Icon icon={faUserSlash} />&nbsp;<span>no account needed</span>
        </span>
        <span className="has-text-grey">
          <Icon icon={faUserSecret} />&nbsp;<span>completely anonymous</span>
        </span>
        <span>
          <a
            href="https://github.com/sergiubologa/thepocketcap"
            target="_blank"
            title="PocketCap - CryptoCurrency investment tracker"
            rel="noopener noreferrer"><Icon icon={faGithub} /> open source</a>
        </span>
      </p>
      <br /><br />
      <button
        className="btn-add-new-transaction button is-primary"
        onClick={props.onAddNewTransaction}>
        <Icon icon={faPlus} />&nbsp;Add my first transaction
      </button>
    </div>
  )
}
