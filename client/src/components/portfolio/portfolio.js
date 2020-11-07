// @flow
import React, { Component } from "react";
import qs from "qs";
import Icon from "../elements/icon/icon";
import { faPlus, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import * as Utils from "../../utils/utils";
import AnimatedStyledNumber from "../elements/animated-styled-number/animated-styled-number";
import Tooltip from "../elements/tooltip/tooltip";
import TrendIcon from "../elements/trend-icon/trend-icon";
import NoTransactions from "./components/no-transactions/no-transactions";
import PreviousTransactions from "./components/previous-transactions/previous-transactions";
import Transaction from "./components/transaction/transaction";
import Toolbar from "./components/toolbar/toolbar";
import { URL_PARAM_NAMES } from "../../constants/common";
import PortfolioStore from "../../stores/portfolio-store";
import PortfolioActions from "../../actions/portfolio-actions";
import type { Props } from "../../flow-types/react-generic";
import type { PortfolioState as State } from "../../flow-types/portfolio";
import "./portfolio.css";

export default class Portfolio extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...PortfolioStore.getPortfolio()
    };
    this.updateStateData = this.updateStateData.bind(this);
    this.onAddNewTransaction = this.onAddNewTransaction.bind(this);

    const urlParams: Object = qs.parse(Utils.getHashFromUrl());
    if (urlParams) {
      const portfolio: ?string = urlParams[URL_PARAM_NAMES.PORTFOLIO];
      PortfolioActions.setPortfolioFromEncodedUrlParam(portfolio);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      this.state.transactions !== nextState.transactions ||
      this.state.totalInvested !== nextState.totalInvested ||
      this.state.currentTotalValue !== nextState.currentTotalValue ||
      this.state.totalMargin !== nextState.totalMargin ||
      this.state.totalProfit !== nextState.totalProfit ||
      this.state.previousTransactions !== nextState.previousTransactions
    ) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    PortfolioStore.removeListener("change", this.updateStateData);
    PortfolioActions.clearPortfolio();
  }

  componentDidMount() {
    PortfolioActions.fetchCoinsData();
    PortfolioActions.checkForPreviousPortfolio();
    PortfolioStore.on("change", this.updateStateData);
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio());
  };

  onAddNewTransaction = (): void => {
    PortfolioActions.addNewTransaction();
  };

  render() {
    const {
      totalInvested,
      currentTotalValue,
      totalMargin,
      totalProfit,
      transactions,
      previousTransactions
    } = this.state;
    const displayTotalInvested = Utils.toDecimals(totalInvested);
    const displayCurrentTotalValue = Utils.toDecimals(currentTotalValue);
    const displayTotalMargin = Utils.toDecimals(totalMargin);
    const displayTotalProfit = Utils.toDecimals(totalProfit);
    const inEditTransaction = this.state.transactions.find(t => t.editMode);
    const isEditMode = !!inEditTransaction;
    const hasTransactions = transactions && transactions.length > 0;
    const addNewBtnColSpan = Utils.isSmall() ? 3 : Utils.isLarge() ? 3 : 3;

    return (
      <div className="portfolio">
        {hasTransactions && <Toolbar />}

        {hasTransactions && (
          <table
            className={`table is-fullwidth ${isEditMode ? "is-edit-mode" : "is-hoverable"
              }`}
          >
            <thead className="has-background-light">
              <tr>
                <th className="h-coin has-text-weight-bold is-size-7">Coin</th>
                <th className="h-units has-text-right has-text-weight-bold is-size-7">
                  Units
                </th>
                <th className="h-initial-price col-initial-price has-text-right has-text-weight-bold is-size-7">
                  Initial Price
                  <br />
                  <span className="is-size-7 has-text-weight-light is-size-7">
                    ($ per unit)
                  </span>
                </th>
                <th className="h-current-price col-current-price has-text-right has-text-weight-bold is-size-7">
                  Current Price
                  <br />
                  <span className="is-size-7 has-text-weight-light">
                    ($ per unit)
                  </span>
                  &nbsp;
                  <Tooltip tip="Prices from CoinMarketCap">
                    <Icon icon={faQuestionCircle} className="has-text-grey" />
                  </Tooltip>
                </th>
                <th className="h-total-invested col-total-invested has-text-right has-text-weight-bold is-size-7">
                  Total invested
                </th>
                <th className="h-current-value col-current-value has-text-right has-text-weight-bold is-size-7">
                  Current value
                </th>
                <th className="h-profit has-text-right has-text-weight-bold is-size-7">
                  Profit
                </th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th colSpan={addNewBtnColSpan} className="has-text-centered">
                  <button
                    className="btn-add-new-transaction button is-primary is-small"
                    onClick={this.onAddNewTransaction}
                  >
                    <Icon icon={faPlus} />
                    &nbsp;Add new {!Utils.isSmall() && " transaction"}
                  </button>
                </th>
                <th className="col-total-text has-text-right has-text-weight-semibold is-size-5">
                  Total:
                </th>
                <th className="col-total-invested has-text-right has-text-weight-semibold has-background-light">
                  $<AnimatedStyledNumber value={displayTotalInvested} />
                </th>
                <th className="col-current-value has-text-right has-text-weight-semibold has-background-light">
                  $<AnimatedStyledNumber value={displayCurrentTotalValue} />
                </th>
                <th
                  className={`has-text-right has-text-weight-semibold has-background-light ${Utils.colorClassForNumbers(
                    displayTotalProfit
                  )}`}
                >
                  $<AnimatedStyledNumber value={displayTotalProfit} />
                  <br />
                  <TrendIcon value={displayTotalProfit} />
                  &nbsp;
                  <span className="is-size-7">
                    <AnimatedStyledNumber value={displayTotalMargin} />%
                  </span>
                </th>
              </tr>
            </tfoot>
            <tbody>
              {transactions.map((transaction, i) => (
                <Transaction key={i} index={i} transaction={transaction} />
              ))}
            </tbody>
          </table>
        )}

        {!hasTransactions && (
          <NoTransactions onAddNewTransaction={this.onAddNewTransaction} />
        )}

        {!hasTransactions &&
          previousTransactions &&
          previousTransactions.length > 0 && (
            <PreviousTransactions
              transactions={previousTransactions}
              onClick={PortfolioActions.loadPreviousPortfolio}
            />
          )}
      </div>
    );
  }
}
