// @flow

export type TextboxProps = {
  value: string,
  isValid?: boolean,
  placeholder?: string,
  onChange?: (value: string) => void
}

export type TextboxState = {
  isTouched: boolean
}
