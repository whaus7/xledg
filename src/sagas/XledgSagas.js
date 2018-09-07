import { call, put } from 'redux-saga/effects';
import XledgActions from '../redux/XledgRedux';
//import { notification } from '../services/helpers';

const notifyError = response => {
   console.log('ERROR');
   console.log(response);
};

const success = response => {
   // OK 200 if unhandled error, so need to check for success
   if (response.status === 200 && typeof response.data === 'string') {
      let failure =
         !response.ok ||
         response.data.indexOf('<!DOCTYPE html>') >= 0 ||
         response.data.indexOf('<!doctype html>') >= 0;

      return !failure;
   } else {
      return response.ok;
   }
};

// Get all gateways from data API
export function* getGateways(api) {
   const response = yield call(api.getGateways);

   if (success(response)) {
      yield put(XledgActions.getGatewaysSuccess(response));
   } else {
      notifyError(response);
      yield put(XledgActions.getGatewaysFailure(response));
   }
}

// Get exchange price history for charts
export function* getExchangeHistory(api, { baseCurrency, counterCurrency }) {
   const response = yield call(api.getExchangeHistory, baseCurrency, counterCurrency);

   if (success(response)) {
      yield put(XledgActions.getExchangeHistorySuccess(response));
      // notification(
      //    'success',
      //    `success`
      // );
   } else {
      notifyError(response);
      yield put(XledgActions.getExchangeHistoryFailure(response));
   }
}

// Connect to Ripple API
export function* connect(api) {
   const response = yield call(api.connect);

   // Successfully connected to the Ripple API
   // So lets do fun things
   if (response === 'success') {
      yield put(XledgActions.connectSuccess(response));
   } else {
      notifyError(response);
      yield put(XledgActions.connectFailure(response));
   }
}

// Get the current accounts account info (XRP balance)
export function* getAccountInfo(api, { address }) {
   const response = yield call(api.getAccountInfo, address);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.getAccountInfoFailure(response));
   } else {
      yield put(XledgActions.getAccountInfoSuccess(response));
   }
}

// Get the current accounts balance sheet
export function* getBalanceSheet(api, { address }) {
   const response = yield call(api.getBalanceSheet, address);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.getBalanceSheetFailure(response));
   } else {
      yield put(XledgActions.getBalanceSheetSuccess(response));
   }
}

// Get the current order book for the selected pair
export function* updateOrderBook(api, { address, pair }) {
   const response = yield call(api.updateOrderBook, address, pair);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.updateOrderBookFailure(response));
   } else {
      yield put(XledgActions.updateOrderBookSuccess(response));
   }
}

// Prepare the current order for submission
export function* prepareOrder(api, { address, order, instructions }) {
   const response = yield call(api.prepareOrder, address, order, instructions);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.prepareOrderFailure(response));
   } else {
      yield put(XledgActions.prepareOrderSuccess(response, order));
   }
}

// Cancel an open order
export function* cancelOrder(api, { address, orderCancellation }) {
   const response = yield call(api.cancelOrder, address, orderCancellation);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.cancelOrderFailure(response));
   } else {
      yield put(XledgActions.cancelOrderSuccess(response));
   }
}

// Sign a transaction
export function* signTx(api, { txJSON, key }) {
   const response = yield call(api.signTx, txJSON, key);
   console.log(response);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.signTxFailure(response));
   } else {
      yield put(XledgActions.signTxSuccess(response));
   }
}

// Submit a signed transaction
export function* submitTx(api, { signedTx }) {
   const response = yield call(api.submitTx, signedTx);
   console.log('submit TX response');
   console.log(response);

   if (response.resultCode === 'tesSUCCESS') {
      yield put(XledgActions.submitTxSuccess(response));
   } else {
      notifyError(response);
      yield put(XledgActions.submitTxFailure(response));
   }
}

// Get the status of a pending transaction
export function* getTxStatus(api, { txID }) {
   const response = yield call(api.getTxStatus, txID);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.getTxStatusFailure(response));
   } else {
      yield put(XledgActions.getTxStatusSuccess(response));
   }
}

// Get all transactions for an account (created/partially filled/completed)
export function* getTxs(api, { address }) {
   const response = yield call(api.getTxs, address);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.getTxsFailure(response));
   } else {
      yield put(XledgActions.getTxsSuccess(response));
   }
}

// Returns open orders for the specified account
// Open orders are orders that have not yet been fully executed and are still in the order book
export function* getOrders(api, { address, options }) {
   const response = yield call(api.getOrders, address, options);

   if ('message' in response) {
      notifyError(response);
      yield put(XledgActions.getOrdersFailure(response));
   } else {
      yield put(XledgActions.getOrdersSuccess(response));
   }
}

// Open Transport connection with Ledger Hardware API
export function* openTransport(api) {
   const response = yield call(api.openTransport);

   if (response === 'success') {
      yield put(XledgActions.openTransportSuccess(response));
   } else {
      notifyError(response);
      yield put(XledgActions.openTransportFailure(response));
   }
}

// Open Transport connection with Ledger Hardware API
export function* getWalletAddress(api) {
   const response = yield call(api.getWalletAddress);

   if (typeof response !== 'undefined' && 'address' in response) {
      yield put(XledgActions.getWalletAddressSuccess(response));
   } else {
      notifyError(response);
      yield put(XledgActions.getWalletAddressFailure(response));
   }
}
