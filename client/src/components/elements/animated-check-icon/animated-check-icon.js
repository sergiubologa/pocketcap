// @flow
import * as React from 'react'
import './animated-check-icon.css'

type IconColor = 'danger'|'success'|'info'|'inherit'
type Props = {
  color?: IconColor,
  children?: React.Node
}

const getIconColor = (color?: IconColor): string => {
  switch (color) {
    case 'danger':
      return '#ff3860'
    case 'info':
      return '#209cee'
    case 'success':
      return '#23d160'
    case 'inherit':
    default:
      return 'currentColor'
  }
}

export default (props: Props) => {
  const color = getIconColor(props.color)
  const iconStyle = {
    width: "5rem"
  }
  
  // TODO - this needs to be added in the head tag. I didn't find a solution yet...
  // {`<!--[if lte IE 9]>
  //   <style>
  //     .check-icon .path {stroke-dasharray: 0 !important;}
  //   </style>
  // <![endif]-->`}

  return (
    <React.Fragment>
      <svg className="check-icon" style={iconStyle} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle className="path circle" fill="none" stroke={color} strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
        <polyline className="path check" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
      </svg>
    </React.Fragment>
  )
}
