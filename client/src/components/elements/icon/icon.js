// @flow
import React, {PureComponent} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type {State} from '../../../flow-types/react-generic'

type Props = {
  icon: any,
  className?: string
}

// Wrapper over FontAwesomeIcon to make it pure
export default class Icon extends PureComponent<Props, State> {
  render() {
    const {icon, className} = this.props
    return (
      <FontAwesomeIcon icon={icon} className={className} />
    )
  }
}
