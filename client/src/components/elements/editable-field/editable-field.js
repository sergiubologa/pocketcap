// @flow
import * as React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import './editable-field.css'

type Props = {
  children: React.Node,
  onClick: (name: string) => void,
  name: string,
  className?: string,
  align?: string
}

export default (props: Props) => {
  const {className, align} = props
  const containerClasses = [
    'editable-field',
    align && align === 'right' ? 'align-right' : '',
    className || ''
  ]
  return (
    <div
      className={containerClasses.join(" ")}
      onClick={props.onClick.bind(this, props.name)}
      >
      <div className="field-items">
        <span>{props.children}</span>
      </div>
      <FontAwesomeIcon icon={faPencil} className="field-icon has-text-primary" />
    </div>
  )
}
