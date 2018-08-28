import apisauce from 'apisauce';
const RippleAPI = require('ripple-lib').RippleAPI;

// Will haus and manage both the dataAPI and rippleAPI objects
const apiHaus = (baseURL = 'https://data.ripple.com/v2/', rippleApiBaseURL = 'wss://s2.ripple.com') => {
   const dataAPI = apisauce.create({
      baseURL,
      timeout: 60000
   });

   const rippleAPI = new RippleAPI({
      server: rippleApiBaseURL // Public rippled server hosted by Ripple, Inc.
   });

   // DATA API
   const getGateways = () => {
      return dataAPI.get(`gateways`, '');
   };

   const getExchangeHistory = (baseCurrency, counterCurrency) => {
      return dataAPI.get(
         `/exchanges/${
            baseCurrency.value === 'XRP'
               ? baseCurrency.value
               : baseCurrency.value + '+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
         }/${
            counterCurrency.value === 'XRP'
               ? counterCurrency.value
               : counterCurrency.value + '+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
         }?descending=true&result=tesSUCCESS&interval=1day&limit=1000`
      );
   };

   // RIPPLE API
   const connect = () => {
      return rippleAPI
         .connect()
         .then(() => {
            return 'success';
         })
         .catch(error => {
            return error;
         });
   };

   const getAccountInfo = address => {
      return rippleAPI
         .getAccountInfo(address)
         .then(accountInfo => {
            return accountInfo;
         })
         .catch(error => {
            return error;
         });
   };

   const getBalanceSheet = address => {
      return rippleAPI
         .getBalanceSheet(address)
         .then(balanceSheet => {
            return balanceSheet;
         })
         .catch(error => {
            return error;
         });
   };

   const updateOrderBook = (address, pair) => {
      return rippleAPI
         .getOrderbook(address, pair, {
            limit: 50
         })
         .then(orderBook => {
            return orderBook;
         })
         .catch(error => {
            return error;
         });
   };

   const prepareOrder = (address, order, instructions) => {
      return rippleAPI
         .prepareOrder(address, order, instructions)
         .then(preparedOrder => {
            return preparedOrder;
         })
         .catch(error => {
            return error;
         });
   };

   const cancelOrder = (address, orderCancellation) => {
      return rippleAPI
         .prepareOrderCancellation(address, orderCancellation)
         .then(response => {
            return response;
         })
         .catch(error => {
            return error;
         });
   };

   const signTx = (txJSON, key) => {
      return rippleAPI.sign(txJSON, key);
   };

   const submitTx = signedTx => {
      return rippleAPI
         .submit(signedTx)
         .then(response => {
            return response;
         })
         .catch(error => {
            return error;
         });
   };

   const getTxStatus = txID => {
      return rippleAPI
         .getTransaction(txID)
         .then(txStatus => {
            return txStatus;
         })
         .catch(error => {
            return error;
         });
   };

   const getTxs = account => {
      return rippleAPI
         .getTransactions(account, {
            types: ['payment', 'order'],
            limit: 300
         })
         .then(txs => {
            return txs;
         })
         .catch(error => {
            return error;
         });
   };

   const getOrders = (address, options) => {
      return rippleAPI
         .getOrders(address, options)
         .then(openOrders => {
            return openOrders;
         })
         .catch(error => {
            return error;
         });
   };

   return {
      // All our Data API & Ripple API functions
      getGateways,
      getExchangeHistory,
      connect,
      getAccountInfo,
      getBalanceSheet,
      updateOrderBook,
      prepareOrder,
      cancelOrder,
      signTx,
      submitTx,
      getTxStatus,
      getTxs,
      getOrders
   };
};

export default {
   apiHaus
};
