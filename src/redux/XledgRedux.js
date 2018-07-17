import { createReducer, createActions } from 'reduxsauce';
import update from 'immutability-helper';
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-upsert'));

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   // set the current account status
   // 'new', 'existing', 'corrupt'
   setAccount: ['status'],
   getGateways: [],
   getGatewaysSuccess: ['response'],
   getGatewaysFailure: ['error']
});

export const ActionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
   db: new PouchDB('xledg_db'),
   walletStatus: null,
   gateways: null,
   submitFetching: 'idle'
};

/* ------------- Reducers ------------- */
export const xledgReducer = (state, action) => {
   switch (action.type) {
      case 'SET_ACCOUNT':
         console.log('DEBUG REDUX - set account');
         console.log(state);
         console.log(action);

         return update(state, {
            walletStatus: { $set: action.status }
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

   [Types.GET_GATEWAYS]: dataApiReducer,
   [Types.GET_GATEWAYS_SUCCESS]: dataApiReducer,
   [Types.GET_GATEWAYS_FAILURE]: dataApiReducer
});
