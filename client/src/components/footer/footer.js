// @flow
import React, {Component} from 'react'
import type {Props, State} from '../../flow-types/react-generic'

export default class Footer extends Component<Props, State> {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>Pocket Cap</strong> by <a href="">Sergiu Bologa</a>. The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
