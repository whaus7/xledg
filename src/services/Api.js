import apisauce from 'apisauce';
import Transport from '@ledgerhq/hw-transport-u2f';
import Api from '@ledgerhq/hw-app-xrp';
import { encode, decode } from 'ripple-binary-codec';
import { notification } from './helpers';

const RippleAPI = require('ripple-lib').RippleAPI;
let LedgerAPI = null;

// Will haus and manage both the dataAPI and rippleAPI objects
const apiHaus = (baseURL = 'https://data.ripple.com/v2/', rippleApiBaseURL = 'wss://s2.ripple.com') => {
   const dataAPI = apisauce.create({
      baseURL,
      timeout: 60000
   });

   const rippleAPI = new RippleAPI({
      server: rippleApiBaseURL // Public rippled server hosted by Ripple, Inc.
   });

   // Ledger API
   const openTransport = () => {
      return Transport.create(360000)
         .then(transport => {
            transport.setDebugMode(false);
            transport.setExchangeTimeout(720000);
            LedgerAPI = new Api(transport);
            return 'success';
         })
         .catch(() => {
            console.log('Error: U2F not supported');
         });
   };

   const getWalletAddress = () => {
      return LedgerAPI.getAddress("44'/144'/0'/0/0", true, false, false)
         .then(result => {
            return result;
         })
         .catch(() => {
            console.log('Failed to get wallet address');
         });
   };

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

   // Returns open orders for the specified account.
   // Open orders are orders that have not yet been fully executed and are still in the order book.
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
         .preparePayment(address, order, instructions)
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
      console.log('SIGN DATA');
      console.log(txJSON);

      let unsignedTx = JSON.parse(txJSON);
      unsignedTx.SigningPubKey = key;
      let unsignedTxHex = encode(unsignedTx);

      console.log('son of a ..................awesome ballsss');

      console.log(unsignedTx);
      console.log(unsignedTxHex);
      console.log(LedgerAPI);

      return LedgerAPI.signTransaction("44'/144'/0'/0/0", unsignedTxHex)
         .then(signedTx => {
            let txJSON = decode(unsignedTxHex);
            txJSON.TxnSignature = signedTx.toUpperCase();
            let txHex = encode(txJSON);

            console.log('here?');
            console.log(txHex);

            return txHex.toUpperCase();
         })
         .catch(error => {
            console.log(error);
            notification('The order was declined or an error has occurred', 'error');
         });
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
      getOrders,
      openTransport,
      getWalletAddress
   };
};

export default {
   apiHaus
};
