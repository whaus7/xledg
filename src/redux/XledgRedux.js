import { createReducer, createActions } from 'reduxsauce';
import update from 'immutability-helper';
import PouchDB from 'pouchdb';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
   // set the current account status
   // 'new', 'existing', 'corrupt'
   setAccount: ['status']
});

export const ActionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
   db: new PouchDB('xledg_db'),
   walletStatus: null
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

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
   [Types.SET_ACCOUNT]: xledgReducer
});
