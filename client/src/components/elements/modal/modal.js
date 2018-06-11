// @flow
import * as React from 'react'
type Props = {
  children: React.Node,
  isOpen: boolean,
  title: string,
  onCloseRequest: () => void
}

export default (props: Props) => {
  const modalClasses = ["modal"]
  if (props.isOpen) modalClasses.push("is-active")

  return (
    <div className={modalClasses.join(" ")}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button className="delete" aria-label="close" onClick={props.onCloseRequest}></button>
        </header>
        <section className="modal-card-body">
          {props.children}
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={props.onCloseRequest}>Close</button>
        </footer>
      </div>
    </div>
  )
}
