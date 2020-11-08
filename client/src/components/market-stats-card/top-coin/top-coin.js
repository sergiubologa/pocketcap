import React from "react";
import CoinIcon from "../../elements/coin-icon/coin-icon";
import Tooltip from "../../elements/tooltip/tooltip";
import * as Utils from "../../../utils/utils";

export default props => {
  const { coin, ...rest } = props;

  if (!coin) {
    return null;
  }

  return (
    <Tooltip tip={coin.name} {...rest}>
      <a
        href={`https://coinmarketcap.com/currencies/${coin.name.toLowerCase()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <CoinIcon symbol={coin && coin.symbol} /> {coin && coin.symbol}
        </div>
        <div className="has-text-green">
          {coin && Utils.toDecimals(coin.quote.USD.percent_change_24h)}%
        </div>
      </a>
    </Tooltip>
  );
};
