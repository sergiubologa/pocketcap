// @flow
export const isValidDecimal = (value: ?string|?number): boolean => {
  const decimalString: string = value ? value.toString() : value === 0 ? '0' : ''
  const regex: RegExp = /^\d+(\.\d{1,8})?$/
  return regex.test(decimalString)
}

export const toDecimals = (value: ?number, decimals: number = 2): ?number => {
  if (!value && value !== 0) {
    return null
  }
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export const toMoneyString = (value: ?number) => {
  if (!value && value !== 0) {
    return ''
  }
  return `$${value.toLocaleString()}`
}

export const getHashFromUrl = (ignoreQueryPrefix: boolean = true) => {
  const hash = window.location.hash
  return ignoreQueryPrefix ? hash.replace(/^#\?/, "") : hash
}

export const setHashInUrl = (hash: string) => {
  if (hash.charAt(0) !== '?') {
    hash = `?${hash}`
  }
  window.location.hash = hash
}

export const colorClassForNumbers = (value: ?number): string => {
  if (!value && value !== 0) {
    return ''
  }

  if (value === 0) {
    return 'has-text-yellow'
  }

  return `has-text-${value > 0 ? 'green' : 'danger'}`
}

export const faIconNameForNumbers = (value: ?number): string => {
  if (!value && value !== 0) {
    return ''
  }

  if (value === 0) {
    return 'fa-caret-right'
  }

  return `fa-${value > 0 ? 'caret-up' : 'caret-down'}`
}
