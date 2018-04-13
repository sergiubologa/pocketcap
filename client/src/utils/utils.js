// @flow
export const isValidDecimal = (value: ?string|?number): boolean => {
  const decimalString: string = value ? value.toString() : value === 0 ? '0' : ''
  const regex: RegExp = /^\d+(\.\d{1,8})?$/
  return regex.test(decimalString)
}

export const toDecimals = (value: ?number, decimals: number = 2) => {
  if (!value && value !== 0) {
    return value
  }

  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
