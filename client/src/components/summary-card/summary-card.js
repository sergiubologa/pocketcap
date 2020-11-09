// @flow
import React, { PureComponent } from "react";
import "./summary-card.css";
import type { Props } from "../../flow-types/react-generic";
import type { PortfolioState as State } from "../../flow-types/portfolio";
import PortfolioStore from "../../stores/portfolio-store";
import * as Utils from "../../utils/utils";

export default class SummaryCard extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...PortfolioStore.getPortfolio()
    };
    this.updateStateData = this.updateStateData.bind(this);
  }

  componentDidMount() {
    PortfolioStore.on("change", this.updateStateData);
  }

  componentWillUnmount() {
    PortfolioStore.removeListener("change", this.updateStateData);
  }

  updateStateData = (): void => {
    this.setState(PortfolioStore.getPortfolio());
  };

  render() {
    const {
      totalInvested,
      currentTotalValue,
      totalMargin,
      totalProfit,
      transactions
    } = this.state;
    const displayTotalInvested = Utils.toDecimals(
      totalInvested
    ).toLocaleString();
    const displayCurrentTotalValue = Utils.toDecimals(
      currentTotalValue
    ).toLocaleString();
    const displayTotalMargin = Utils.toDecimals(totalMargin).toLocaleString();
    const displayTotalProfit = Utils.toDecimals(totalProfit).toLocaleString();
    const hasTransactions = transactions && transactions.length > 0;
    const colorClass = Utils.colorClassForNumbers(totalProfit);
    const isProfitZero = Utils.toDecimals(totalProfit) == 0;
    const cardColor = isProfitZero ? "" : totalProfit > 0 ? "green" : "red";

    return hasTransactions ? (
      <div className={`card summary-card ${cardColor}`}>
        <div className="card-content">
          <div className="data">
            <div className="item">
              <span className="is-size-6 has-text-weight-semibold">
                ${displayTotalInvested}
              </span>
              <div className="is-size-7 has-text-weight-light">Invested</div>
            </div>
            <div className="item">
              <span className="is-size-6 has-text-weight-semibold">
                ${displayCurrentTotalValue}
              </span>
              <div className="is-size-7 has-text-weight-light">
                Current value
              </div>
            </div>
            <div className="item">
              <span
                className={`is-size-6 has-text-weight-semibold ${colorClass}`}
              >
                ${displayTotalProfit}
              </span>

              <div className={`is-size-7 has-text-weight-light ${colorClass}`}>
                {Utils.toDecimals(totalProfit) > 0 ? "+" : ""}{" "}
                {displayTotalMargin}%
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}
