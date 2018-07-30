import { createReducer, createActions } from 'reduxsauce';
import update from 'immutability-helper';
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-upsert'));

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   // reset saga progress variable to idle
   resetToIdle: [],

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
   db: new PouchDB('xledg_db'),
   walletStatus: null,
   gateways: null,
   submitFetching: 'idle',

   action: 'buy',
   // BASE
   baseAmount: '',
   baseCurrency: '',
   // COUNTER
   counterPrice: '',
   counterCurrency: ''
};

/* ------------- Reducers ------------- */
export const xledgReducer = (state, action) => {
   switch (action.type) {
      case 'RESET_TO_IDLE':
         return update(state, {
            submitFetching: { $set: 'idle' }
         });
      case 'SET_ACCOUNT':
         console.log('DEBUG REDUX - set account');
         console.log(state);
         console.log(action);

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
         return update(state, {
            baseCurrency: { $set: action.currency }
         });
      case 'UPDATE_COUNTER_PRICE':
         return update(state, {
            counterPrice: { $set: action.price }
         });
      case 'UPDATE_COUNTER_CURRENCY':
         return update(state, {
            counterCurrency: { $set: action.currency }
         });
      default:
         return state;
   }
};

export const dataApiReducer = (state, action) => {
   switch (action.type) {
      case 'GET_GATEWAYS':
         return update(state, {
            submitFetching: { $set: 'idle' }
         });
      case 'GET_GATEWAYS_SUCCESS':
         console.log('DEBUG REDUX - get gateways');
         console.log(state);
         console.log(action);

         //return state;
         return update(state, {
            gateways: { $set: action.response.data },
            submitFetching: { $set: 'success' }
         });
      case 'GET_GATEWAYS_FAILURE':
         return update(state, {
            submitFetching: { $set: 'fail' }
         });
      default:
         return state;
   }
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
   [Types.SET_ACCOUNT]: xledgReducer,
   [Types.RESET_TO_IDLE]: xledgReducer,

   [Types.UPDATE_ACTION]: xledgReducer,
   [Types.UPDATE_BASE_AMOUNT]: xledgReducer,
   [Types.UPDATE_BASE_CURRENCY]: xledgReducer,
   [Types.UPDATE_COUNTER_PRICE]: xledgReducer,
   [Types.UPDATE_COUNTER_CURRENCY]: xledgReducer,

   [Types.GET_GATEWAYS]: dataApiReducer,
   [Types.GET_GATEWAYS_SUCCESS]: dataApiReducer,
   [Types.GET_GATEWAYS_FAILURE]: dataApiReducer
});
