// @flow
import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import Portfolio from "../../portfolio/portfolio";
import MarketStatsCard from "../../market-stats-card/market-stats-card";
import type { State, Props } from "../../../flow-types/react-generic";
import "./portfolio-page.css";

export default class PortfolioPage extends Component<Props, State> {
  render() {
    return (
      <DocumentTitle title="Pocket Cap">
        <div className="columns" id="portfolio-container">
          <div className="column">
            <Portfolio />
          </div>
          <div className="column">
            <MarketStatsCard />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
