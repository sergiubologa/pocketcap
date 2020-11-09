// @flow
import React, { PureComponent } from "react";
import moment from "moment";
import Icon from "../elements/icon/icon";
import {
  faAngleDown,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../elements/tooltip/tooltip";
import MarketStatsStore from "../../stores/market-stats-store";
import PortfolioStore from "../../stores/portfolio-store";
import * as Utils from "../../utils/utils";
import type { Props } from "../../flow-types/react-generic";
import type { MarketStatsState as State } from "../../flow-types/market-stats";
import type { Coin, CoinsData } from "../../flow-types/coins";
import "./market-stats-card.css";
import TopCoin from "./top-coin/top-coin";

type Best3CoinsCache = {
  [key: string]: Array<Coin>
};

export default class MarketStatsCard extends PureComponent<Props, State> {
  best3CoinsCache: Best3CoinsCache = {};
  refreshStatsIntervalId: IntervalID;
  REFRESH_STATS_INTERVAL_MS: number = 10 * 60 * 1000; // 10 minutes

  constructor(props: Props) {
    super(props);

    this.state = {
      ...MarketStatsStore.getMarketStats(),
      best3Coins: this.getBest3Coins()
    };

    this.updateStateData = this.updateStateData.bind(this);
  }

  componentWillUnmount() {
    MarketStatsStore.removeListener("change", this.updateStateData);
    PortfolioStore.removeListener("change", this.updateBestCoinsData);
    clearInterval(this.refreshStatsIntervalId);
  }

  componentDidMount() {
    this.fetchNewStatsData();
    this.refreshStatsIntervalId = setInterval(
      this.fetchNewStatsData.bind(this),
      this.REFRESH_STATS_INTERVAL_MS
    );

    MarketStatsStore.on("change", this.updateStateData);
    PortfolioStore.on("change", this.updateBestCoinsData);
  }

  fetchNewStatsData() {
    MarketStatsStore.fetchMarketStatsData();
  }

  updateStateData = (): void => {
    this.setState({ ...MarketStatsStore.getMarketStats() });
  };

  updateBestCoinsData = (): void => {
    this.setState({ best3Coins: this.getBest3Coins() });
  };

  getBest3Coins = (): Array<Coin> => {
    // var t0 = performance.now()
    const coinsData: CoinsData = PortfolioStore.getCoinsData();
    const best3Coins: Array<Coin> = [];
    const activateCache = false;

    if (coinsData) {
      if (coinsData.added_at && activateCache) {
        const cachedData = this.best3CoinsCache[coinsData.added_at];
        if (cachedData) {
          // var t1 = performance.now()
          // console.log('from cache: ' + (t1 - t0) + " milliseconds.")
          // console.log('items in cache: ' + Object.keys(this.best3CoinsCache).length)
          return cachedData;
        }
      }

      for (let i = 0, len = coinsData.data.length; i < len; i++) {
        const currentCoin: Coin = coinsData.data[i];

        if (currentCoin.quote.USD.percent_change_24h) {
          const firstCoin: Coin = best3Coins[0];
          const secondCoin: Coin = best3Coins[1];
          const thirdCoin: Coin = best3Coins[2];

          if (
            firstCoin &&
            firstCoin.quote.USD.percent_change_24h &&
            currentCoin.quote.USD.percent_change_24h >
            firstCoin.quote.USD.percent_change_24h
          ) {
            best3Coins.unshift(currentCoin);
            if (thirdCoin) best3Coins.splice(-1, 1);
          } else if (
            secondCoin &&
            secondCoin.quote.USD.percent_change_24h &&
            currentCoin.quote.USD.percent_change_24h >
            secondCoin.quote.USD.percent_change_24h
          ) {
            best3Coins.splice(1, 0, currentCoin);
            if (thirdCoin) best3Coins.splice(-1, 1);
          } else if (
            thirdCoin &&
            thirdCoin.quote.USD.percent_change_24h &&
            currentCoin.quote.USD.percent_change_24h >
            thirdCoin.quote.USD.percent_change_24h
          ) {
            best3Coins.splice(2, 1, currentCoin);
          } else if (best3Coins.length < 3) {
            best3Coins.push(currentCoin);
          }
        }
      }

      if (coinsData.added_at && activateCache) {
        this.best3CoinsCache[coinsData.added_at] = best3Coins;
      }
    }

    // var t2 = performance.now()
    // console.log('from iterating: ' + (t2 - t0) + " milliseconds.")
    return best3Coins;
  };

  render() {
    const {
      stats = {},
      isUpdatingStatsData,
      best3Coins = [],
      lastStatsUpdate
    } = this.state;

    const marketCap: ?number = Utils.safePick(
      stats,
      "data",
      "quote",
      "USD",
      "total_market_cap"
    );
    const volume24hrs: ?number = Utils.safePick(
      stats,
      "data",
      "quote",
      "USD",
      "total_volume_24h"
    );
    const btcDominance: ?number = Utils.safePick(
      stats,
      "data",
      "btc_dominance"
    );
    const firstCoin: Coin = best3Coins[0];
    const secondCoin: Coin = best3Coins[1];
    const thirdCoin: Coin = best3Coins[2];

    return stats ? (
      <div className="card market-stats-card">
        <div className="card-content">
          <p className="title">
            Market Stats
            <Tooltip
              tip="Data from CoinMarketCap"
              className="is-pulled-right is-size-5"
              style={{ marginTop: "8px" }}
            >
              <Icon icon={faQuestionCircle} className="has-text-grey" />
            </Tooltip>
          </p>
          <p className="subtitle is-7">
            next update
            {isUpdatingStatsData ? (
              <span> loading...</span>
            ) : (
                <span>
                  {" "}
                  {moment(lastStatsUpdate)
                    .clone()
                    .add(this.REFRESH_STATS_INTERVAL_MS, "ms")
                    .fromNow()}
                </span>
              )}
          </p>

          <div className="stats-container">
            <div className="stat">
              <span className="category is-size-6 has-text-weight-light">
                Total market cap
              </span>
              <span className="value is-size-7 has-text-weight-semibold">
                {Utils.toMoneyString(Utils.toDecimals(marketCap, 0))}
              </span>
            </div>
            <div className="stat">
              <span className="category is-size-6 has-text-weight-light">
                Volume 24h
              </span>
              <span className="value is-size-7 has-text-weight-semibold">
                {Utils.toMoneyString(Utils.toDecimals(volume24hrs, 0))}
              </span>
            </div>
            <div className="stat">
              <span className="category is-size-6 has-text-weight-light">
                BTC share
              </span>
              <span className="value is-size-7 has-text-weight-semibold">
                {Utils.toDecimals(btcDominance, 2) || "N/A"}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="is-size-7 has-text-weight-semibold is-marginless has-text-centered has-text-grey">
            <Icon icon={faAngleDown} />
            &nbsp;
            <span>best performers in the last 24 hrs</span>&nbsp;
            <Icon icon={faAngleDown} />
          </p>
        </div>
        <footer className="card-footer">
          <TopCoin
            coin={firstCoin}
            className="card-footer-item has-text-centered"
          />
          <TopCoin
            coin={secondCoin}
            className="card-footer-item has-text-centered"
          />
          <TopCoin
            coin={thirdCoin}
            className="card-footer-item has-text-centered"
          />
        </footer>
      </div>
    ) : null;
  }
}
