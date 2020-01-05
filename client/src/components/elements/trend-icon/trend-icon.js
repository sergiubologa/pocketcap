// @flow
import React from 'react'
import Icon from '../icon/icon'
import { faCaretUp, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import type {State} from '../../../flow-types/react-generic'

type Props = {
  value: ?number,
  className?: string
}

export default class TrendIcon extends React.PureComponent<Props, State> {
  render() {
    const {value, ...rest} = this.props

    if (!value && value !== 0) {
      return null;
    }

    let icon = faCaretRight;
    if (value > 0) {
      icon = faCaretUp
    } else if (value < 0) {
      icon = faCaretDown
    }

    return <Icon icon={icon} {...rest} />
  }
}
