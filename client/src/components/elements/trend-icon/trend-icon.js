// @flow
import React from 'react'
import Icon from '../icon/icon'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'
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
