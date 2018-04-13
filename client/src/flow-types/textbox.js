// @flow

export type TextboxProps = {
  value: string,
  isValid?: boolean,
  placeholder?: string,
  autoFocus?: boolean,
  onChange?: (value: string) => void
}

export type TextboxState = {
  isTouched: boolean
}
