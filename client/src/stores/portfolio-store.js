// @flow
import axios from "axios";
import qs from "qs";
import JsonUrl from "json-url";
// import 'json-url/dist/browser/json-url-msgpack'
// import 'json-url/dist/browser/json-url-lzw'
// import 'json-url/dist/browser/json-url-lzma'
// import 'json-url/dist/browser/json-url-lzstring'
// import 'json-url/dist/browser/json-url-safe64'
// import "json-url/dist/browser/json-url-single"
import EventEmitter from "events";
import AppDispatcher from "../app-dispatcher";
import { Names as PortfolioActionsNames } from "../actions/portfolio-actions";
import * as Utils from "../utils/utils";
import { URL_PARAM_NAMES } from "../constants/common";
import type {
  PortfolioState,
  Transaction,
  URLPortfolio
} from "../flow-types/portfolio";
import type { CoinsData, Coin } from "../flow-types/coins";
import type { Codec } from "../flow-types/vendors";
import type { Action } from "../flow-types/actions";

class PortfolioStore extends EventEmitter {
  PREVIOUS_TRANSACTIONS_HASH_KEY: string = "PREVIOUS_TRANSACTIONS_HASH"; // used to suggest open last created portfolio
  COINS_DATA_STORAGE_KEY: string = "COINS_DATA";
  COINS_UPDATE_INTERVAL: number = 5 * 60; // 5 minutes
  COINS_UPDATE_INTERVAL_ON_FAILURE: number = 0.5 * 60; // 30 seconds
  SECONDS_TO_SHAKE_BUTTON: number = 1;
  SHAKE_BUTTON_TIMEOUT: TimeoutID;

  backedupPortfolio: ?PortfolioState = null;
  portfolio: PortfolioState = this.defaultPortfolio();

  async fetchCoinsData() {
    this.portfolio = {
      ...this.portfolio,
      isUpdatingCoinsData: true
    };
    this.emit("change");

    try {
      const res = await axios.get("/api/coins");
      const coins = res.data;
      localStorage.setItem(this.COINS_DATA_STORAGE_KEY, JSON.stringify(coins));
      this.portfolio = {
        ...this.portfolio,
        secToNextUpdate: this.COINS_UPDATE_INTERVAL
      };
      this.updateTransactionsCurrentPrices();
    } catch (error) {
      this.portfolio = {
        ...this.portfolio,
        secToNextUpdate: this.COINS_UPDATE_INTERVAL_ON_FAILURE
      };
    } finally {
      this.portfolio = {
        ...this.portfolio,
        isUpdatingCoinsData: false
      };
      this.emit("change");
    }
  }

  async simulateFetchCoinsData() {
    this.portfolio = {
      ...this.portfolio,
      isUpdatingCoinsData: true
    };
    this.emit("change");

    // generate random number between 200 and 700 make it feel real
    const fetchDelay: number = Utils.random(200, 700);
    await Utils.wait(fetchDelay);

    this.portfolio = {
      ...this.portfolio,
      isUpdatingCoinsData: false,
      secToNextUpdate: this.COINS_UPDATE_INTERVAL
    };
    this.emit("change");
  }

  addNewTransaction() {
    this.portfolio = {
      ...this.portfolio,
      transactions: [...this.portfolio.transactions, this.newTransaction()]
    };
    this.emit("change");
  }

  saveTransaction() {
    const inEditTransactionIndex: number = this.portfolio.transactions.findIndex(
      t => t.editMode
    );

    if (inEditTransactionIndex > -1) {
      const inEditTransaction: Transaction = this.portfolio.transactions[
        inEditTransactionIndex
      ];
      const {
        isCoinValid,
        isUnitsValid,
        isInitialPriceValid
      } = inEditTransaction;

      if (isCoinValid && isUnitsValid && isInitialPriceValid) {
        this.portfolio.transactions = Utils.setArrayImmutable(
          this.portfolio.transactions,
          inEditTransactionIndex,
          {
            ...inEditTransaction,
            editMode: false,
            isNew: false
          }
        );

        this.calculateTotalValues();
        this.updateUrlHashForPortfolio();
        this.emit("change");
      }
    }
  }

  updateUrlHashForPortfolio() {
    const { transactions } = this.portfolio;
    const codec: Codec = JsonUrl("lzstring");

    if (transactions && transactions.length > 0) {
      const formatForCompression = (result: URLPortfolio, t: Transaction) => {
        result.push([t.coin.id, t.units, t.initialPrice]);
        return result;
      };
      const urlData: URLPortfolio = transactions.reduce(
        formatForCompression,
        []
      );
      codec.compress(urlData).then((result: string) => {
        this.setPortfolioHashInUrl(result);
        this.emit("change");
        localStorage.setItem(this.PREVIOUS_TRANSACTIONS_HASH_KEY, result);
      });
    } else {
      this.setPortfolioHashInUrl(null);
      this.portfolio = {
        ...this.portfolio,
        previousTransactions: []
      };
      this.emit("change");
      localStorage.removeItem(this.PREVIOUS_TRANSACTIONS_HASH_KEY);
    }
  }

  setPortfolioHashInUrl(portfolioHash: ?string) {
    const parsedParams: Object = qs.parse(Utils.getHashFromUrl());
    parsedParams[URL_PARAM_NAMES.PORTFOLIO] = portfolioHash;
    const hash: string = qs.stringify(parsedParams, { skipNulls: true });
    Utils.setHashInUrl(hash);
    if (this.portfolio.urlHash !== null) {
      this.setButtonToShake();
    }
    this.portfolio = {
      ...this.portfolio,
      urlHash: Utils.getHashFromUrl(false)
    };
  }

  setButtonToShake() {
    this.portfolio = {
      ...this.portfolio,
      shakeCopyToClipboardButton: true
    };
    clearTimeout(this.SHAKE_BUTTON_TIMEOUT);

    this.SHAKE_BUTTON_TIMEOUT = setTimeout(() => {
      this.portfolio = {
        ...this.portfolio,
        shakeCopyToClipboardButton: false
      };
      this.emit("change");
    }, this.SECONDS_TO_SHAKE_BUTTON * 1000);
  }

  setPortfolioFromEncodedUrlParam(encodedPortfolio: ?string) {
    if (encodedPortfolio && encodedPortfolio.length > 0) {
      // If coins data is not available, trigger a fetch and wait until is available
      // We don't want to load the portfolio until coins data is not available
      const coinsData: CoinsData = this.getCoinsData();
      if (coinsData.data.length <= 0) {
        if (!this.portfolio.isUpdatingCoinsData) {
          this.fetchCoinsData().then(() => {
            this.setPortfolioFromEncodedUrlParam(encodedPortfolio);
          });
        } else {
          setTimeout(
            () => this.setPortfolioFromEncodedUrlParam(encodedPortfolio),
            200
          );
        }
        return;
      }

      this.decodeUrlHash(encodedPortfolio).then(urlPortfolio => {
        if (urlPortfolio && urlPortfolio.length > 0) {
          this.portfolio.transactions = this.urlPortfolioToTransactions(
            urlPortfolio
          );
          this.updateTransactionsCurrentPrices();
          this.portfolio.transactions.forEach((t, index) =>
            this.calculateTransactionValues(index)
          );
          this.calculateTotalValues();
          this.emit("change");
          this.updateUrlHashForPortfolio();
        }
      });
    }
  }

  urlPortfolioToTransactions(urlPortfolio: ?URLPortfolio): Array<Transaction> {
    const transactions: Array<Transaction> = [];

    if (urlPortfolio && urlPortfolio.length > 0) {
      const coinsData: CoinsData = this.getCoinsData();
      urlPortfolio.forEach(t => {
        const [coinId, units, initialPrice] = t;
        const coin: ?Coin = coinsData.data.find(c => c.id === coinId);
        if (coin) {
          const transaction: Transaction = this.newTransaction({
            coin: { id: coinId, label: coin.name, symbol: coin.symbol },
            units,
            initialPrice,
            isValid: true,
            editMode: false,
            isNew: false,
            isCoinValid: true,
            isUnitsValid: true,
            isInitialPriceValid: true
          });
          transactions.push(transaction);
        }
      });
    }

    return transactions;
  }

  decodeUrlHash(encodedPortfolio: ?string) {
    if (encodedPortfolio && encodedPortfolio.length > 0) {
      const codec: Codec = JsonUrl("lzstring");
      return codec.decompress(encodedPortfolio).catch(e => {
        // TODO - maybe log the error if the hash is invald?
      });
    }
    return Promise.resolve();
  }

  clearPortfolio() {
    const {
      transactions,
      totalInvested,
      currentTotalValue,
      totalMargin,
      totalProfit,
      secToNextUpdate
    } = this.defaultPortfolio();
    this.portfolio = {
      ...this.portfolio,
      transactions,
      totalInvested,
      currentTotalValue,
      totalMargin,
      totalProfit,
      secToNextUpdate
    };
    this.emit("change");
  }

  cancelTransaction() {
    const transaction = this.portfolio.transactions.find(t => t.editMode);

    if (transaction) {
      if (transaction.isNew) {
        this.portfolio = {
          ...this.portfolio,
          transactions: this.portfolio.transactions.filter(t => !t.editMode)
        };
      } else {
        // $FlowFixMe
        this.portfolio = JSON.parse(JSON.stringify(this.backedupPortfolio));
        this.backedupPortfolio = undefined;
      }

      this.emit("change");
    }
  }

  removeTransaction(index: number) {
    const transaction: Transaction = this.portfolio.transactions[index];

    if (transaction) {
      this.portfolio = {
        ...this.portfolio,
        transactions: this.portfolio.transactions.filter(
          (t: Transaction, i: number) => i !== index
        )
      };

      this.calculateTotalValues();
      this.updateUrlHashForPortfolio();
      this.emit("change");
    }
  }

  editTransaction(index: number) {
    this.cancelTransaction();
    this.backedupPortfolio = JSON.parse(JSON.stringify(this.portfolio));
    const transaction = this.portfolio.transactions[index];
    if (transaction && !transaction.editMode) {
      this.portfolio = {
        ...this.portfolio,
        transactions: Utils.setArrayImmutable(
          this.portfolio.transactions,
          index,
          {
            ...transaction,
            editMode: true
          }
        )
      };
      this.emit("change");
    }
  }

  changeTransaction(transactionIndex: number, newValue: Transaction) {
    this.portfolio = {
      ...this.portfolio,
      transactions: Utils.setArrayImmutable(
        this.portfolio.transactions,
        transactionIndex,
        newValue
      )
    };
  }

  transactionCoinChanged(newCoinId: ?string) {
    const inEditTransaction: ?Transaction = this.portfolio.transactions.find(
      t => t.editMode
    );

    if (inEditTransaction) {
      const inEditTransactionIndex: number = this.portfolio.transactions.findIndex(
        t => t.editMode
      );
      if (!newCoinId) {
        this.changeTransaction(inEditTransactionIndex, {
          ...inEditTransaction,
          coin: {
            ...inEditTransaction.coin,
            id: "",
            label: "",
            symbol: "",
            currentPrice: null,
            isCoinValid: false
          }
        });
        this.calculateTransactionValues(inEditTransactionIndex);
        this.emit("change");
      } else {
        const coins: CoinsData = this.getCoinsData();
        const newCoin: ?Coin = coins.data.find(c => c.id === newCoinId);

        if (newCoin) {
          this.changeTransaction(inEditTransactionIndex, {
            ...inEditTransaction,
            currentPrice: newCoin.quote.USD.price,
            isCoinValid: true,
            coin: {
              ...inEditTransaction.coin,
              id: newCoin.id,
              label: newCoin.name,
              symbol: newCoin.symbol
            }
          });
          this.calculateTransactionValues(inEditTransactionIndex);
          this.emit("change");
        }
      }
    }
  }

  transactionUnitsChanged(units: string) {
    const inEditTransactionIndex: number = this.portfolio.transactions.findIndex(
      t => t.editMode
    );

    if (inEditTransactionIndex > -1) {
      const inEditTransaction: ?Transaction = this.portfolio.transactions.find(
        t => t.editMode
      );
      if (inEditTransaction) {
        this.changeTransaction(inEditTransactionIndex, {
          ...inEditTransaction,
          units,
          isUnitsValid: Utils.isValidDecimal(units) && parseFloat(units) > 0
        });
        this.calculateTransactionValues(inEditTransactionIndex);
        this.emit("change");
      }
    }
  }

  transactionInitialPriceChanged(price: string) {
    const inEditTransactionIndex: number = this.portfolio.transactions.findIndex(
      t => t.editMode
    );

    if (inEditTransactionIndex > -1) {
      const inEditTransaction: ?Transaction = this.portfolio.transactions.find(
        t => t.editMode
      );
      if (inEditTransaction) {
        this.changeTransaction(inEditTransactionIndex, {
          ...inEditTransaction,
          initialPrice: price,
          isInitialPriceValid:
            Utils.isValidDecimal(price) && parseFloat(price) > 0
        });
        this.calculateTransactionValues(inEditTransactionIndex);
        this.emit("change");
      }
    }
  }

  decrementCountdown() {
    this.portfolio = {
      ...this.portfolio,
      secToNextUpdate: this.portfolio.secToNextUpdate - 1
    };

    if (this.portfolio.secToNextUpdate === 0) {
      this.fetchCoinsData();
    } else {
      this.emit("change");
    }
  }

  getPortfolio(): PortfolioState {
    return this.portfolio;
  }

  calculateTransactionValues(transactionIndex: number) {
    const transaction: ?Transaction = this.portfolio.transactions[
      transactionIndex
    ];

    if (transaction) {
      const { isCoinValid, isUnitsValid, isInitialPriceValid } = transaction;
      const isValid: boolean =
        isCoinValid && isUnitsValid && isInitialPriceValid;

      const newTransaction: Transaction = {
        ...transaction,
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        margin: 0
      };

      if (isValid && transaction.currentPrice) {
        const units: number = parseFloat(transaction.units);
        const initialPrice: number = parseFloat(transaction.initialPrice);
        const { currentPrice } = transaction;
        newTransaction.totalInvested = units * initialPrice;
        newTransaction.currentValue = units * (currentPrice || 0);
        newTransaction.profit =
          newTransaction.currentValue - newTransaction.totalInvested;
        newTransaction.margin =
          (newTransaction.profit / newTransaction.totalInvested) * 100;
      }

      this.changeTransaction(transactionIndex, newTransaction);
    }
  }

  calculateTotalValues() {
    const transactions: Array<Transaction> = this.portfolio.transactions.filter(
      t => !t.editMode
    );

    this.portfolio = {
      ...this.portfolio,
      totalInvested: 0,
      currentTotalValue: 0,
      totalMargin: 0,
      totalProfit: 0
    };

    if (transactions && transactions.length > 0) {
      let newTotalInvested: number = 0,
        newCurrentTotalValue: number = 0;
      transactions.forEach(t => {
        newTotalInvested += t.totalInvested;
        newCurrentTotalValue += t.currentValue;
      });
      const newTotalProfit: number = newCurrentTotalValue - newTotalInvested;
      const newTotalMargin: number = (newTotalProfit / newTotalInvested) * 100;
      this.portfolio = {
        ...this.portfolio,
        totalInvested: newTotalInvested,
        currentTotalValue: newCurrentTotalValue,
        totalProfit: newTotalProfit,
        totalMargin: newTotalMargin
      };
    }
  }

  updateTransactionsCurrentPrices() {
    const coins: CoinsData = this.getCoinsData();

    this.portfolio.transactions.forEach((t: Transaction, index: number) => {
      const coin: ?Coin = coins.data.find(c => c.id === t.coin.id);
      if (coin) {
        this.changeTransaction(index, {
          ...t,
          currentPrice: coin.quote.USD.price
        });
        this.calculateTransactionValues(index);
      }
    });

    this.calculateTotalValues();
  }

  getCoinsData(): CoinsData {
    const coins: ?string = localStorage.getItem(this.COINS_DATA_STORAGE_KEY);
    const defaultCoinsData: CoinsData = { added_at: "", data: [] };
    return coins ? JSON.parse(coins) : defaultCoinsData;
  }

  checkForPreviousPortfolio() {
    const previousTransactionsHash: ?string = localStorage.getItem(
      this.PREVIOUS_TRANSACTIONS_HASH_KEY
    );

    this.decodeUrlHash(previousTransactionsHash).then(previousTransactions => {
      if (previousTransactions && previousTransactions.length > 0) {
        this.portfolio = {
          ...this.portfolio,
          previousTransactions: this.urlPortfolioToTransactions(
            previousTransactions
          )
        };
        this.emit("change");
      }
    });
  }

  loadPreviousPortfolio() {
    const previousTransactionsHash: ?string = localStorage.getItem(
      this.PREVIOUS_TRANSACTIONS_HASH_KEY
    );
    this.setPortfolioFromEncodedUrlParam(previousTransactionsHash);
  }

  defaultPortfolio(): PortfolioState {
    return {
      transactions: [],
      totalInvested: 0,
      currentTotalValue: 0,
      totalMargin: 0,
      totalProfit: 0,
      secToNextUpdate: this.COINS_UPDATE_INTERVAL,
      isUpdatingCoinsData: false,
      urlHash: null,
      shakeCopyToClipboardButton: false,
      previousTransactions: []
    };
  }

  newTransaction(details?: Object): Transaction {
    return {
      coin: { id: "", label: "", symbol: "" },
      units: "",
      initialPrice: "",
      currentPrice: null,
      totalInvested: 0,
      currentValue: 0,
      margin: 0,
      profit: 0,
      editMode: true,
      isNew: true,
      isCoinTouched: false,
      isCoinValid: false,
      isUnitsTouched: false,
      isUnitsValid: false,
      isInitialPriceTouched: false,
      isInitialPriceValid: false,
      ...details
    };
  }

  handleActions(action: Action) {
    switch (action.type) {
      case PortfolioActionsNames.ADD_NEW_TRANSACTION:
        this.addNewTransaction();
        break;
      case PortfolioActionsNames.SIMULATE_FETCH_COINS_DATA:
        this.simulateFetchCoinsData();
        break;
      case PortfolioActionsNames.SAVE_TRANSACTION:
        this.saveTransaction();
        break;
      case PortfolioActionsNames.CANCEL_TRANSACTION:
        this.cancelTransaction();
        break;
      case PortfolioActionsNames.REMOVE_TRANSACTION:
        this.removeTransaction(action.data);
        break;
      case PortfolioActionsNames.EDIT_TRANSACTION:
        this.editTransaction(action.data);
        break;
      case PortfolioActionsNames.FETCH_COINS_DATA:
        this.fetchCoinsData();
        break;
      case PortfolioActionsNames.TRANSACTION_COIN_CHANGED:
        this.transactionCoinChanged(action.data);
        break;
      case PortfolioActionsNames.TRANSACTION_UNITS_CHANGED:
        this.transactionUnitsChanged(action.data);
        break;
      case PortfolioActionsNames.TRANSACTION_INITIAL_PRICE_CHANGED:
        this.transactionInitialPriceChanged(action.data);
        break;
      case PortfolioActionsNames.DECREMENT_COUNTDOWN:
        this.decrementCountdown();
        break;
      case PortfolioActionsNames.SET_PORTFOLIO_FROM_ENCODED_URL_PARAM:
        this.setPortfolioFromEncodedUrlParam(action.data);
        break;
      case PortfolioActionsNames.CLEAR_PORTFOLIO:
        this.clearPortfolio();
        break;
      case PortfolioActionsNames.CHECK_FOR_PREVIOUS_PORTFOLIO:
        this.checkForPreviousPortfolio();
        break;
      case PortfolioActionsNames.LOAD_PREVIOUS_PORTFOLIO:
        this.loadPreviousPortfolio();
        break;
      default:
        break;
    }
  }
}

const portfolioStore = new PortfolioStore();
AppDispatcher.register(portfolioStore.handleActions.bind(portfolioStore));

export default portfolioStore;
