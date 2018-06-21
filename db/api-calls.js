const axios = require("axios");

const get = (path, params) => {
  const { COINMARKETCAP_ENDPOINT, COINMARKETCAP_API_KEY } = process.env;
  const url = `${COINMARKETCAP_ENDPOINT}/${path}`;

  return axios.get(url, {
    params,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
    }
  });
};

module.exports = {
  get
};
