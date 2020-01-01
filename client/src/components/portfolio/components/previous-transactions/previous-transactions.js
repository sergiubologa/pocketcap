// @flow
import React from "react";
import CoinIcon from "../../../elements/coin-icon/coin-icon";
import * as Utils from "../../../../utils/utils";
import type { Transaction } from "../../../../flow-types/portfolio";
import "./previous-transactions.css";

type Props = {
  transactions: Array<Transaction>,
  onClick: () => null
};

export default (props: Props) => {
  const { transactions, onClick } = props;
  const totalCoins: ?number = Utils.toDecimals(
    transactions.reduce((total, t) => total + parseFloat(t.units), 0)
  );
  const investment: ?number = Utils.toDecimals(
    transactions.reduce(
      (total, t) => total + parseFloat(t.units) * parseFloat(t.initialPrice),
      0
    )
  );
  return (
    <div className="prevTransactionsContainer has-text-centered">
      <div className="or has-text-grey">or</div>
      <div className="box transactions has-text-grey" onClick={onClick}>
        <header>
          <h4>Load your previous portfolio</h4>
        </header>
        <div className="coins">
          {transactions.map((t, index) => (
            <CoinIcon key={index} symbol={t.coin.symbol} />
          ))}
          {transactions && transactions.length > 10 && (
            <div className="fader" />
          )}
        </div>

        <div className="tags">
          {totalCoins && (
            <span className="tag">Units: {totalCoins.toLocaleString()}</span>
          )}
          {investment && (
            <span className="tag">
              Investment: ${investment.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
