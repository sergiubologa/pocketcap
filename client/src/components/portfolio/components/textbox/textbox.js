// @flow
import React, { PureComponent } from "react";
import Icon from "../../../elements/icon/icon";
import { faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import type {
  TextboxProps as Props,
  TextboxState as State
} from "../../../../flow-types/textbox";
import * as Utils from "../../../../utils/utils";

export default class Textbox extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isTouched: false };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (e: Event): void => {
    if (this.props.onChange && e.target instanceof HTMLInputElement) {
      this.props.onChange.call(null, e.target.value);
    }
    if (!this.state.isTouched) {
      this.setState({ isTouched: true });
    }
  };

  onBlur = (): void => {
    this.setState({ isTouched: true });
  };

  render() {
    const {
      value,
      isValid,
      placeholder,
      autoFocus,
      leftIcon,
      className
    } = this.props;
    const showIcons = !Utils.isSmall();
    const { isTouched } = this.state;
    const inputClasses = ["input"];
    if (isTouched) {
      inputClasses.push(isValid ? "is-success" : "is-danger");
    }
    inputClasses.push(className);
    const validationIconElement =
      !isTouched || !showIcons ? (
        undefined
      ) : (
          <span className="icon is-small is-right">
            <Icon
              icon={isValid ? faCheck : faBan}
              className={isValid ? "has-text-success" : "has-text-danger"}
            />
          </span>
        );

    const showLeftIcon = !!leftIcon && showIcons;

    const leftIconElement = !showLeftIcon ? (
      undefined
    ) : (
        <span className="icon is-small is-left">
          <Icon icon={leftIcon} />
        </span>
      );

    return (
      <div className="textbox field is-text-7">
        <div
          className={`control 
          ${showLeftIcon ? "has-icons-left" : ""}
          ${isTouched && showIcons ? "has-icons-right" : ""}
          `}
        >
          <input
            className={inputClasses.join(" ")}
            autoFocus={autoFocus}
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={value}
            placeholder={placeholder}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
          {leftIconElement}
          {validationIconElement}
        </div>
      </div>
    );
  }
}
