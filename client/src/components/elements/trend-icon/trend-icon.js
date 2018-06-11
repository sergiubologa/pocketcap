// @flow
import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'

type Props = {
  value: ?number,
  className?: string
}

export default (props: Props) => {
  const {value, ...rest} = props

  if (!value && value !== 0) {
    return null;
  }

  let icon = faCaretRight;
  if (value > 0) {
    icon = faCaretUp
  } else if (value < 0) {
    icon = faCaretDown
  }

  return <FontAwesomeIcon icon={icon} {...rest} />
}
