import { call, put, select } from 'redux-saga/effects';
//import HTTPStatus from 'http-status';
import store from '../redux';
//import 'babel-polyfill';
//import Case from 'case';
import XledgActions from '../redux/XledgRedux';
import { notification } from '../services/helpers';

// const notifyError = response => {
//    const bugReportButtons = [
//       Noty.button('Dismiss', 'btn btn-danger openBugReportLink', function() {
//          Noty.closeAll('bugReportNotification' + pageKey);
//       }),
//       Noty.button('Submit Bug Report', 'btn btn-primary', function() {
//          store.dispatch({ type: 'SUBMIT_BUG_REPORT' });
//          $('#bugReportModal').modal('show');
//       })
//    ];
//    // if found to be actually a CakePHP error sent with 200 OK status
//    if (response.status === 200) {
//       const start = response.data.indexOf('<title>') + 23;
//       const end = response.data.indexOf('</title>');
//
//       const message = response.data.slice(start, end);
//
//       notification('error', `Unknown error - ${message}`, false, bugReportButtons, 'bugReportNotification');
//    } else {
//       notification(
//          'error',
//          `${response.status} error: ${HTTPStatus[response.status]} - ${response.data.error} `,
//          false
//       );
//    }
// };

const success = response => {
   // CakePHP send OK 200 if unhandled error, so need to check for success
   if (response.status === 200 && typeof response.data === 'string') {
      let failure =
         !response.ok || response.data.indexOf('<!DOCTYPE html>') >= 0 || response.data.indexOf('<!doctype html>') >= 0;

      return !failure;
   } else {
      return response.ok;
   }
};

// edit asset details
export function* getGateways(api) {
   const response = yield call(api.getGateways);

   if (success(response)) {
      yield put(XledgActions.getGatewaysSuccess(response));
      // notification(
      //    'success',
      //    `success`
      // );
   } else {
      //notifyError(response);
      yield put(XledgActions.getGatewaysFailure(response));
   }
}
