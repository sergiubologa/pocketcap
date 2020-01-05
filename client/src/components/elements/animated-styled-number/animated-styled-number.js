// @flow
import React, { PureComponent } from "react";
import AnimatedNumber from "react-animated-number";
import type { State } from "../../../flow-types/react-generic";

type Props = {
  value: ?number,
  decimalPlaces?: number,
  styled?: boolean
};

export default class AnimatedStyledNumber extends PureComponent<Props, State> {
  static defaultProps = {
    decimalPlaces: 2,
    styled: true
  };

  render() {
    const { value, decimalPlaces, styled } = this.props;
    const style = styled
      ? {
          transition: "0.5s ease-out",
          transitionProperty: "background-color, color, opacity"
        }
      : {};
    const frameStyle = perc => {
      return isNaN(perc) || perc === 100 ? {} : { backgroundColor: "#fff6be" };
    };
    const formatNumber = n => n.toLocaleString();

    return (
      <AnimatedNumber
        value={value || 0}
        duration={300}
        stepPrecision={decimalPlaces}
        style={style}
        formatValue={formatNumber}
        frameStyle={styled ? frameStyle : () => {}}
      />
    );
  }
}
