import { call, put, select } from 'redux-saga/effects';
import XledgActions from '../redux/XledgRedux';
import { notification } from '../services/helpers';

const notifyError = response => {
   console.log(response);
};

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

// get all gateways
export function* getGateways(api) {
   const response = yield call(api.getGateways);

   if (success(response)) {
      yield put(XledgActions.getGatewaysSuccess(response));
      // notification(
      //    'success',
      //    `success`
      // );
   } else {
      notifyError(response);
      yield put(XledgActions.getGatewaysFailure(response));
   }
}
