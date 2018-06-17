// @flow
import * as React from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import './tooltip.css'

type Props = {
  tip: string,
  children: React.Node,
  style?: Object,
  className?: string
}

type State = {
  isHovering: boolean
}

// Currently supports only top-end placement
// TODO - extend it to support other positionings
export default class Tooltip extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { isHovering: false }
    this.hover = this.hover.bind(this)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.tip !== nextProps.tip ||
        this.props.className !== nextProps.className) {
      return true
    }
    if (this.state.isHovering !== nextState.isHovering) {
      return true
    }
    return false
  }

  hover = () =>
    this.setState(({ isHovering }) => ({ isHovering: !isHovering }))

  render() {
    const {tip, children, style, className} = this.props
    const { isHovering } = this.state
    const classes = ["tooltip-container", className]

    return (
      <span
        className={classes.join(" ")}
        style={style}
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
                <span ref={ref} style={style} data-placement={placement} className="tooltip">
                  {tip}
                  <span ref={arrowProps.ref} style={arrowProps.style} className="tooltip-arrow" />
                </span>
              )}
            </Popper>
          )}
        </Manager>
      </span>
    )
  }
}
