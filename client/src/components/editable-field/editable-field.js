// @flow
import * as React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import type {State} from '../../flow-types/react-generic'
import './editable-field.css'

type Props = {
  children: React.Node,
  onClick: (name: string) => void,
  name: string,
  className?: string,
  align?: string
}

export default class EditableField extends React.Component<Props, State> {
  render() {
    const {className, align} = this.props
    const containerClasses = [
      'editable-field',
      align && align === 'right' ? 'align-right' : '',
      className || ''
    ]
    return (
      <div
        className={containerClasses.join(" ")}
        onClick={this.props.onClick.bind(this, this.props.name)}
        >
        <div className="field-items">
          <span>{this.props.children}</span>
        </div>
        <FontAwesomeIcon icon={faPencil} className="field-icon has-text-primary" />
      </div>
    )
  }
}
