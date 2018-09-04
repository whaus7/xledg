import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/Api';

// Action Types
import { ActionTypes } from '../redux/XledgRedux';

// Sagas
import {
   getGateways,
   getExchangeHistory,
   connect,
   getBalanceSheet,
   getAccountInfo,
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
} from './XledgSagas';

// API
const xledgAPI = API.apiHaus();

/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
   yield all([takeLatest(ActionTypes.GET_GATEWAYS, getGateways, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_EXCHANGE_HISTORY, getExchangeHistory, xledgAPI)]);
   yield all([takeLatest(ActionTypes.CONNECT, connect, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_ACCOUNT_INFO, getAccountInfo, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_BALANCE_SHEET, getBalanceSheet, xledgAPI)]);
   yield all([takeLatest(ActionTypes.UPDATE_ORDER_BOOK, updateOrderBook, xledgAPI)]);
   yield all([takeLatest(ActionTypes.PREPARE_ORDER, prepareOrder, xledgAPI)]);
   yield all([takeLatest(ActionTypes.CANCEL_ORDER, cancelOrder, xledgAPI)]);
   yield all([takeLatest(ActionTypes.SIGN_TX, signTx, xledgAPI)]);
   yield all([takeLatest(ActionTypes.SUBMIT_TX, submitTx, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_TX_STATUS, getTxStatus, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_TXS, getTxs, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_ORDERS, getOrders, xledgAPI)]);
   yield all([takeLatest(ActionTypes.OPEN_TRANSPORT, openTransport, xledgAPI)]);
   yield all([takeLatest(ActionTypes.GET_WALLET_ADDRESS, getWalletAddress, xledgAPI)]);
}
