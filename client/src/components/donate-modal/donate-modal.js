// @flow
import React from 'react'
import Modal from '../elements/modal/modal'
type Props = {
  isOpen: boolean,
  onCloseRequest: () => void
}

export default (props: Props) => {
  return (
    <Modal title="Make a donation" {...props}>
      <p>Donate now!</p>
    </Modal>
  )
}
