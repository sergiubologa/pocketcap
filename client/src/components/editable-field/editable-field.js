// @flow
import * as React from 'react'
import type {State} from '../../flow-types/react-generic'
import './editable-field.css'

type Props = {
  children: React.Node,
  onClick: (name: string) => void,
  name: string,
  className?: string
}

export default class EditableField extends React.Component<Props, State> {
  render() {
    return (
      <div
        className={`editable-field ${this.props.className || ''}`}
        onClick={this.props.onClick.bind(this, this.props.name)}
        >
        <div className="field-items">{this.props.children}</div>
        <i className="field-icon fa fa-pencil has-text-primary"></i>
      </div>
    )
  }
}
