// @flow
import * as React from 'react'
import './modal.css'
type FooterAlignment = 'right'|'center'|'left-right'
type Props = {
  children: React.Node,
  isOpen: boolean,
  title: string,
  alignFooter?: FooterAlignment,
  onCloseRequest: () => void
}

export default (props: Props) => {
  const {title, onCloseRequest, isOpen, children, alignFooter} = props
  const modalClasses = ["modal"]
  if (isOpen) modalClasses.push("is-active")
  const footerClasses = ["modal-card-foot"]
  if (alignFooter) footerClasses.push(`align-${alignFooter}`)

  return (
    <div className={modalClasses.join(" ")}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={onCloseRequest}></button>
        </header>
        <section className="modal-card-body">
          {children}
        </section>
        <footer className={footerClasses.join(" ")}>
          <button className="button" onClick={onCloseRequest}>Done!</button>
        </footer>
      </div>
    </div>
  )
}
