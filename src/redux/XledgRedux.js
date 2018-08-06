import { createReducer, createActions } from 'reduxsauce';
import update from 'immutability-helper';
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-upsert'));

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
   // reset saga progress variable to idle
   resetToIdle: [],

   connect: [],
   connectSuccess: ['response'],
   connectFailure: ['error'],

   getAccountInfo: [],
   getAccountInfoSuccess: ['response'],
   getAccountInfoFailure: ['error'],

   getBalanceSheet: [],
   getBalanceSheetSuccess: ['response'],
   getBalanceSheetFailure: ['error'],

   updateOrderBook: ['pair'],
   updateOrderBookSuccess: ['response'],
   updateOrderBookFailure: ['error'],

   // set the current account status
   // 'new', 'existing', 'corrupt'
   setAccount: ['status'],
   getGateways: [],
   getGatewaysSuccess: ['response'],
   getGatewaysFailure: ['error'],

   updateAction: ['action'],
   updateBaseAmount: ['amount'],
   updateBaseCurrency: ['currency'],
   updateCounterPrice: ['price'],
   updateCounterCurrency: ['currency']
});

export const ActionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
   // xLedg UI
   db: new PouchDB('xledg_db'),
   walletStatus: null,
   action: 'buy',

   // Data API
   gateways: null,

   // Ripple API
   rippleApiConnected: false,
   accountInfo: null,
   balanceSheet: null,
   baseAmount: '',
   baseCurrency: {
      icon: '/icons/xrp.png',
      label: 'XRP',
      value: 'XRP'
   },
   counterPrice: '',
   counterCurrency: {
      icon: '/icons/usd.png',
      label: 'Dollar',
      value: 'USD'
   },
   pair: {
      // Default Pair
      base: {
         currency: 'XRP'
      },
      counter: {
         currency: 'USD',
         counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
      }
   },
   orderBook: null
};

/* ------------- Reducers ------------- */
export const xledgReducer = (state, action) => {
   switch (action.type) {
      case 'RESET_TO_IDLE':
         return state;
      case 'SET_ACCOUNT':
         return update(state, {
            walletStatus: { $set: action.status }
         });
      case 'UPDATE_ACTION':
         return update(state, {
            action: { $set: action.action }
         });
      case 'UPDATE_BASE_AMOUNT':
         return update(state, {
            baseAmount: { $set: action.amount }
         });
      case 'UPDATE_BASE_CURRENCY':
         let base = {
            currency: action.currency.value
         };
         if (action.currency.value !== 'XRP') {
            //base.counterparty = action.currency.counterparty;
            // TODO need counterparty selection in UI
            base.counterparty = 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B';
         }

         return update(state, {
            baseCurrency: { $set: action.currency },
            pair: { base: { $set: base } }
         });
      case 'UPDATE_COUNTER_PRICE':
         return update(state, {
            counterPrice: { $set: action.price }
         });
      case 'UPDATE_COUNTER_CURRENCY':
         let counter = {
            currency: action.currency.value
         };
         if (action.currency.value !== 'XRP') {
            //counter.counterparty = action.currency.counterparty;
            // TODO need counterparty selection in UI
            counter.counterparty = 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B';
         }

         return update(state, {
            counterCurrency: { $set: action.currency },
            pair: { counter: { $set: counter } }
         });
      default:
         return state;
   }
};

export const dataApiReducer = (state, action) => {
   switch (action.type) {
      case 'GET_GATEWAYS':
         return state;
      case 'GET_GATEWAYS_SUCCESS':
         return update(state, {
            gateways: { $set: action.response.data }
         });
      case 'GET_GATEWAYS_FAILURE':
         return state;
      default:
         return state;
   }
};

export const rippleApiReducer = (state, action) => {
   switch (action.type) {
      // CONNECT
      case 'CONNECT':
         return state;
      case 'CONNECT_SUCCESS':
         return update(state, {
            rippleApiConnected: { $set: true }
         });
      case 'CONNECT_FAILURE':
         return update(state, {
            rippleApiConnected: { $set: false }
         });

      // ACCOUNT INFO
      case 'GET_ACCOUNT_INFO':
         return state;
      case 'GET_ACCOUNT_INFO_SUCCESS':
         return update(state, {
            accountInfo: { $set: action.response }
         });
      case 'GET_ACCOUNT_INFO_FAILURE':
         return state;

      // BALANCE SHEET
      case 'GET_BALANCE_SHEET':
         return state;
      case 'GET_BALANCE_SHEET_SUCCESS':
         return update(state, {
            balanceSheet: { $set: action.response }
         });
      case 'GET_BALANCE_SHEET_FAILURE':
         return state;

      // ORDER BOOK
      case 'UPDATE_ORDER_BOOK':
         return state;
      case 'UPDATE_ORDER_BOOK_SUCCESS':
         // console.log('DEBUG REDUX - ripple API update order book');
         // console.log(state);
         // console.log(action);

         return update(state, {
            orderBook: { $set: action.response }
         });
      case 'UPDATE_ORDER_BOOK_FAILURE':
         return state;

      default:
         return state;
   }
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
   // xLedg Actions
   [Types.SET_ACCOUNT]: xledgReducer,
   [Types.RESET_TO_IDLE]: xledgReducer,
   [Types.UPDATE_ACTION]: xledgReducer,
   [Types.UPDATE_BASE_AMOUNT]: xledgReducer,
   [Types.UPDATE_BASE_CURRENCY]: xledgReducer,
   [Types.UPDATE_COUNTER_PRICE]: xledgReducer,
   [Types.UPDATE_COUNTER_CURRENCY]: xledgReducer,

   // Ripple API Actions
   [Types.CONNECT]: rippleApiReducer,
   [Types.CONNECT_SUCCESS]: rippleApiReducer,
   [Types.CONNECT_FAILURE]: rippleApiReducer,

   [Types.GET_ACCOUNT_INFO]: rippleApiReducer,
   [Types.GET_ACCOUNT_INFO_SUCCESS]: rippleApiReducer,
   [Types.GET_ACCOUNT_INFO_FAILURE]: rippleApiReducer,

   [Types.GET_BALANCE_SHEET]: rippleApiReducer,
   [Types.GET_BALANCE_SHEET_SUCCESS]: rippleApiReducer,
   [Types.GET_BALANCE_SHEET_FAILURE]: rippleApiReducer,

   [Types.UPDATE_ORDER_BOOK]: rippleApiReducer,
   [Types.UPDATE_ORDER_BOOK_SUCCESS]: rippleApiReducer,
   [Types.UPDATE_ORDER_BOOK_FAILURE]: rippleApiReducer,

   // Data API Actions
   [Types.GET_GATEWAYS]: dataApiReducer,
   [Types.GET_GATEWAYS_SUCCESS]: dataApiReducer,
   [Types.GET_GATEWAYS_FAILURE]: dataApiReducer
});
