// @flow
import * as React from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import './tooltip.css'

type Props = {
  tip: string,
  children: React.Node
}

type State = {
  isHovering: boolean
}

// Currently supports only top-end placement
// TODO - extend it to support other positionings
export default class Tooltip extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { isHovering: false }
    this.hover = this.hover.bind(this)
  }

  hover = () =>
    this.setState(({ isHovering }) => ({ isHovering: !isHovering }))

  render() {
    const {tip, children} = this.props
    const { isHovering } = this.state
    return (
      <div
        className="tooltip-container"
        onMouseEnter={this.hover}
        onMouseLeave={this.hover}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <span ref={ref}>
                {children}
              </span>
            )}
          </Reference>
          {isHovering && (
            <Popper
              placement="top-end"
              modifiers={{
                preventOverflow: { enabled: false },
                flip: {
                  boundariesElement: 'scrollParent',
                  behavior: ['top', 'bottom', 'top'],
                },
                hide: { enabled: false },
              }}
            >
              {({ ref, style, placement, arrowProps }) => (
                <div ref={ref} style={style} data-placement={placement} className="tooltip">
                  {tip}
                  <div ref={arrowProps.ref} style={arrowProps.style} className="tooltip-arrow" />
                </div>
              )}
            </Popper>
          )}
        </Manager>
      </div>
    )
  }
}
