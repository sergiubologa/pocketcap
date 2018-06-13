// @flow
import * as React from 'react'
import {Transition} from 'react-transition-group'
type Props = {
  isVisible: boolean,
  children: React.Node
}

const duration = 200
const defaultStyle = {
  transition: `transform ${duration}ms linear`,
  transform: 'scale(0)'
}
const transitionStyles = {
  entering: { transform: 'scale(0)' },
  entered:  { transform: 'scale(1)' },
  // exiting: { left: 0, width: 0 },
  // exited: { left: -390, width: 0 },
  // unmounted: {}
}

export default (props: Props) => {
  return (
    <Transition in={props.isVisible} timeout={200}>
      {transitionState => (
        <div className="tab-content" style={{...defaultStyle, ...transitionStyles[transitionState]}}>
          {props.children}
        </div>
      )}
    </Transition>
  )
}
