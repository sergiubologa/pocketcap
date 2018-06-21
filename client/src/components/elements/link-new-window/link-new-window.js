// @flow
import * as React from 'react'
type Props = {
  url: string,
  children: React.Node,
  className?: string
}

const openInNewWindow = (url) => {
  const {
    screenLeft, screenTop, screenX, screenY,
    innerWidth, innerHeight, screen
  } = window
  const {documentElement} = document

  const title = ''
  const width = 600
  const height = 300

  const dualScreenLeft = screenLeft !== undefined ? screenLeft : screenX
  const dualScreenTop = screenTop !== undefined ? screenTop : screenY
  const screenWidth = innerWidth ? innerWidth : documentElement && documentElement.clientWidth ? documentElement.clientWidth : screen.width
  const screenHeight = innerHeight ? innerHeight : documentElement && documentElement.clientHeight ? documentElement.clientHeight : screen.height
  const left = ((screenWidth / 2) - (width / 2)) + dualScreenLeft
  const top = ((screenHeight / 2) - (height / 2)) + dualScreenTop

  const newWindow = window.open(url, title, `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`)

  // Puts focus on the newWindow
  if (window.focus) {
      newWindow.focus()
  }
}

export default (props: Props) => {
  const {url, className, children} = props
  return (
    <a
      className={className ? className : ''}
      onClick={openInNewWindow.bind(this, url)}
    >
      {children}
    </a>
  )
}
