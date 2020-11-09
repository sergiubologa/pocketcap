// @flow
export const isValidDecimal = (value: ?string | ?number): boolean => {
  const decimalString: string = value
    ? value.toString()
    : value === 0
      ? "0"
      : "";
  const regex: RegExp = /^\d+(\.\d{1,8})?$/;
  return regex.test(decimalString);
};

export const toDecimals = (value: ?number, decimals: number = 2): ?number => {
  if (!value && value !== 0) {
    return null;
  }
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const toMoneyString = (value: ?number) => {
  if (!value && value !== 0) {
    return "";
  }
  return `$${toDecimals(value).toLocaleString()}`;
};

export const getHashFromUrl = (ignoreQueryPrefix: boolean = true) => {
  const hash = window.location.hash;
  return ignoreQueryPrefix ? hash.replace(/^#\?/, "") : hash;
};

export const setHashInUrl = (hash: string) => {
  if (hash.charAt(0) !== "?") {
    hash = `?${hash}`;
  }
  window.location.hash = hash;
};

export const colorClassForNumbers = (value: ?number): string => {
  if (!value && value !== 0) {
    return "";
  }

  if (toDecimals(value) == 0) {
    return "has-text-grey";
  }

  return `has-text-${value > 0 ? "green" : "danger"}`;
};

export const safePick = (obj: Object, ...props: Array<string>): any => {
  if (props && props.length > 0) {
    try {
      const value = obj[props[0]];
      props.shift();
      return safePick(value, ...props);
    } catch (error) {
      return null;
    }
  }

  return obj === undefined ? null : obj;
};

export const setArrayImmutable = (arr: Array<any>, index: number, value: any) =>
  Object.assign([...arr], { [index]: value });

export const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const random = (min: ?number, max: ?number): number => {
  let random = Math.random();

  if (min || max) {
    const maxNumOfSteps: number = 30;
    let steps: number = 0;

    while ((min && random < min) || (max && random > max)) {
      const payload = Math.random() * 1000;

      if (min && random < min) {
        random += payload;
      } else if (max && random > max) {
        random -= payload;
      }

      steps++;
      if (steps >= maxNumOfSteps) {
        return min || random;
      }
    }
  }

  return random;
};

export const getPageWidth = () => {
  const bodyMax = document.body
    ? Math.max(document.body.scrollWidth, document.body.offsetWidth)
    : 0;

  const docElementMax = document.documentElement
    ? Math.max(
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
    : 0;

  return Math.max(bodyMax, docElementMax);
};

export const isSmall = () => getPageWidth() < 768;
export const isMedium = () => !isSmall() && getPageWidth() <= 1024;
export const isLarge = () => !isMedium() && getPageWidth() <= 1280;
export const isExtraLarge = () => !isLarge() && getPageWidth() > 1280;
