// @flow

export type TextboxProps = {
  value: string,
  isValid?: boolean,
  placeholder?: string,
  autoFocus?: boolean,
  onChange?: (value: string) => void,
  className?: string
}

export type TextboxState = {
  isTouched: boolean
}
