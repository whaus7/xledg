import apisauce from 'apisauce';
const RippleAPI = require('ripple-lib').RippleAPI;

// Will haus and manage both the dataAPI and rippleAPI objects
const apiHaus = (baseURL = 'https://data.ripple.com/v2/', rippleApiBaseURL = 'wss://s1.ripple.com') => {
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

   const getAccountInfo = () => {
      return rippleAPI
         .getAccountInfo('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf')
         .then(accountInfo => {
            return accountInfo;
         })
         .catch(error => {
            return error;
         });
   };

   const getBalanceSheet = () => {
      return rippleAPI
         .getBalanceSheet('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf')
         .then(balanceSheet => {
            return balanceSheet;
         })
         .catch(error => {
            return error;
         });
   };

   const updateOrderBook = pair => {
      return rippleAPI
         .getOrderbook('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf', pair, {
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

   const signTx = (txJSON, key) => {
      return rippleAPI.sign(txJSON, key);
   };

   const submitTx = signedTransaction => {
      return rippleAPI
         .submit(signedTransaction)
         .then(response => {
            return response;
         })
         .catch(error => {
            return error;
         });
   };

   return {
      // All our Data API & Ripple API functions
      getGateways,
      connect,
      getAccountInfo,
      getBalanceSheet,
      updateOrderBook,
      prepareOrder,
      signTx,
      submitTx
   };
};

export default {
   apiHaus
};
