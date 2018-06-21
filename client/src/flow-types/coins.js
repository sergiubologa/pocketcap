// @flow
export type Coin = {
  id: string,
  name: string,
  symbol: string,
  num_market_pairs: number,
  tags: [string],
  max_supply: number,
  circulating_supply: number,
  total_supply: number,
  cmc_rank: number,
  quote: {
    USD: {
      price: number,
      volume_24h: number,
      percent_change_1h: number,
      percent_change_24h: number,
      percent_change_7d: number,
      market_cap: number
    }
  }
};

export type CoinsData = {
  added_at: string,
  data: Array<Coin>
};
