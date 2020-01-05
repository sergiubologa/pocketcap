// @flow
import React, { Fragment, PureComponent } from "react";
import Icon from "../../../elements/icon/icon";
import {
  faMinus,
  faCheck,
  faBan,
  faDollarSign,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import AnimatedStyledNumber from "../../../elements/animated-styled-number/animated-styled-number";
import PortfolioActions from "../../../../actions/portfolio-actions";
import PortfolioStore from "../../../../stores/portfolio-store";
import CoinsSelect from "../../../elements/coins-select/coins-select";
import Textbox from "../textbox/textbox";
import TrendIcon from "../../../elements/trend-icon/trend-icon";
import EditableField from "../../../elements/editable-field/editable-field";
import CoinIcon from "../../../elements/coin-icon/coin-icon";
import * as Utils from "../../../../utils/utils";
import type {
  TransactionRowProps as Props,
  TransactionState as State
} from "../../../../flow-types/portfolio";
import type { Coin, CoinsData } from "../../../../flow-types/coins";
import type { CoinSelectOption } from "../../../../flow-types/coins-select";
import "./transaction.css";

export default class Transaction extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fieldToFocus: "coin",
      isCoinMenuOpen: false,
      isInDeleteConfirmation: false
    };
    this.onCoinChange = this.onCoinChange.bind(this);
    this.onUnitsChange = this.onUnitsChange.bind(this);
    this.onInitialPriceChange = this.onInitialPriceChange.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onRemoveTransaction = this.onRemoveTransaction.bind(this);
    this.onCancelRemoveTransaction = this.onCancelRemoveTransaction.bind(this);
    this.onSaveTransaction = this.onSaveTransaction.bind(this);
    this.onCancelTransaction = this.onCancelTransaction.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown, true);
  }

  onCoinChange = (selectedCoin: ?CoinSelectOption): void => {
    const coinId: ?string = selectedCoin ? selectedCoin.id : null;
    PortfolioActions.transactionCoinChanged(coinId);
  };

  onUnitsChange = (units: string): void => {
    PortfolioActions.transactionUnitsChanged(units.replace(",", "."));
  };

  onInitialPriceChange = (initialPrice: string): void => {
    PortfolioActions.transactionInitialPriceChanged(
      initialPrice.replace(",", ".")
    );
  };

  onCellClick = (name: string): void => {
    const { editMode } = this.props.transaction;

    if (!editMode) {
      PortfolioActions.editTransaction(this.props.index);
      this.setState({ fieldToFocus: name });
    }
  };

  onSaveTransaction = (): void => {
    PortfolioActions.saveTransaction();
  };

  onCancelTransaction = (): void => {
    PortfolioActions.cancelTransaction();
  };

  onKeyDown = (e: KeyboardEvent) => {
    const { editMode: isEditMode } = this.props.transaction;
    const { isCoinMenuOpen } = this.state;

    if (isEditMode && !isCoinMenuOpen) {
      switch (e.key) {
        case "Escape":
          PortfolioActions.cancelTransaction();
          break;
        case "Enter":
          const {
            isCoinValid,
            isUnitsValid,
            isInitialPriceValid
          } = this.props.transaction;
          const isValid = isCoinValid && isUnitsValid && isInitialPriceValid;
          isValid && PortfolioActions.saveTransaction();
          break;
        default:
          break;
      }
    }
  };

  onRemoveTransaction = (): void => {
    if (this.state.isInDeleteConfirmation) {
      this.setState({ isInDeleteConfirmation: false });
      PortfolioActions.removeTransaction(this.props.index);
    } else {
      this.setState({ isInDeleteConfirmation: true });
    }
  };

  onCancelRemoveTransaction = (): void => {
    if (this.state.isInDeleteConfirmation) {
      this.setState({ isInDeleteConfirmation: false });
    }
  };

  getCoinsDataForSelect = (): Array<CoinSelectOption> => {
    const coins: CoinsData = PortfolioStore.getCoinsData();
    return coins.data.map((coin: Coin) => ({
      id: coin.id,
      label: `${coin.name} (${coin.symbol})`,
      symbol: coin.symbol
    }));
  };

  render() {
    const {
      transaction: {
        coin,
        units,
        initialPrice,
        currentPrice,
        totalInvested,
        currentValue,
        margin,
        profit,
        editMode,
        isCoinValid,
        isUnitsValid,
        isInitialPriceValid
      }
    } = this.props;

    const coinValue = coin.id || coin.symbol || coin.label ? coin : null;
    const isSaveEnabled = isCoinValid && isUnitsValid && isInitialPriceValid;

    const displayCurrentPrice = Utils.toDecimals(currentPrice, 6);
    const displayTotalInvested = Utils.toDecimals(totalInvested);
    const displayCurrentValue = Utils.toDecimals(currentValue);
    const displayProfit = Utils.toDecimals(profit);
    const displayMargin = Utils.toDecimals(margin);

    const { fieldToFocus, isInDeleteConfirmation } = this.state;

    return (
      <tr className={`trTransaction ${editMode ? "is-edit-mode" : ""}`}>
        <td>
          {editMode ? (
            <CoinsSelect
              clearable={false}
              autoFocus={fieldToFocus === "coin"}
              isValid={isCoinValid}
              onChange={this.onCoinChange}
              onOpen={() => this.setState({ isCoinMenuOpen: true })}
              onClose={() => this.setState({ isCoinMenuOpen: false })}
              coins={this.getCoinsDataForSelect()}
              value={coinValue}
              placeholder=""
              icon={<Icon icon={isCoinValid ? faCheck : faBan} />}
            />
          ) : (
            <div className="coin-cell wrap-text">
              {!isInDeleteConfirmation && (
                <button
                  className="btnRemoveTransaction button is-dwarf is-warning is-outlined"
                  onClick={this.onRemoveTransaction}
                >
                  <span className="icon is-small">
                    <Icon icon={faMinus} />
                  </span>
                </button>
              )}
              {isInDeleteConfirmation && (
                <Fragment>
                  <button
                    className="btnRemoveTransaction button is-dwarf is-info is-outlined"
                    onClick={this.onCancelRemoveTransaction}
                  >
                    {Utils.isSmall() ? (
                      <span className="icon is-small">
                        <Icon icon={faArrowLeft} />
                      </span>
                    ) : (
                      "Cancel"
                    )}
                  </button>
                  <button
                    className="btnRemoveTransaction button is-dwarf is-danger is-outlined"
                    onClick={this.onRemoveTransaction}
                  >
                    {Utils.isSmall() ? (
                      <span className="icon is-small">
                        <Icon icon={faCheck} />
                      </span>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </Fragment>
              )}
              <EditableField
                className="field"
                onClick={this.onCellClick}
                name="coin"
              >
                <CoinIcon symbol={coin.symbol} /> {coin.label}
              </EditableField>
            </div>
          )}
        </td>
        <td className="has-text-right">
          {editMode ? (
            <Textbox
              value={units}
              isValid={isUnitsValid}
              autoFocus={fieldToFocus === "units"}
              className="has-text-right"
              onChange={this.onUnitsChange}
            />
          ) : (
            <EditableField
              onClick={this.onCellClick}
              name="units"
              align="right"
            >
              {Number(units).toString()}
            </EditableField>
          )}
        </td>
        <td className="col-initial-price has-text-right">
          <div className="initial-price-cell-wrapper">
            {editMode ? (
              <Textbox
                value={initialPrice}
                isValid={isInitialPriceValid}
                autoFocus={fieldToFocus === "initial-price"}
                className="has-text-right"
                leftIcon={faDollarSign}
                onChange={this.onInitialPriceChange}
              />
            ) : (
              <EditableField
                onClick={this.onCellClick}
                name="initial-price"
                align="right"
              >
                {Utils.toMoneyString(Number(initialPrice))}
              </EditableField>
            )}
            <div
              className={`action-buttons buttons ${
                editMode ? "visible" : "invisible"
              }`}
            >
              <button
                className="button is-dark"
                onClick={this.onCancelTransaction}
              >
                Cancel
              </button>
              <button
                className="button is-primary"
                onClick={this.onSaveTransaction}
                disabled={!isSaveEnabled}
              >
                <Icon icon={faCheck} />
                &nbsp;Save transaction
              </button>
            </div>
          </div>
        </td>
        <td className="col-current-price has-text-right">
          $
          <AnimatedStyledNumber value={displayCurrentPrice} decimalPlaces={6} />
        </td>
        <td className="col-total-invested has-text-right">
          $<AnimatedStyledNumber value={displayTotalInvested} />
        </td>
        <td className="col-current-value has-text-right">
          $<AnimatedStyledNumber value={displayCurrentValue} />
        </td>
        <td
          className={`has-text-right wrap-text ${Utils.colorClassForNumbers(
            displayProfit
          )}`}
        >
          $<AnimatedStyledNumber value={displayProfit} />
          <br />
          <TrendIcon value={displayProfit} />
          &nbsp;
          <span className="is-size-7">
            <AnimatedStyledNumber value={displayMargin} />%
          </span>
        </td>
      </tr>
    );
  }
}

// {Utils.toMoneyString(displayProfit)}
