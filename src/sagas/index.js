import { takeLatest, all, take } from 'redux-saga/effects';
//import 'babel-polyfill';
import API from '../services/Api';
//import DebugConfig from '../Config/DebugConfig';

const RippleAPI = require('ripple-lib').RippleAPI;

/* ------------- Types ------------- */
import { ActionTypes } from '../redux/XledgRedux';

/* ------------- Sagas ------------- */

import { getGateways, apiConnect } from './XledgSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
//const api = DebugConfig.useFixtures ? FixtureAPI : API.create();
const dataAPI = API.create();

const rippleAPI = new RippleAPI({
   server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
});

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
   yield all([takeLatest(ActionTypes.GET_GATEWAYS, getGateways, dataAPI)]);
   yield all([takeLatest(ActionTypes.API_CONNECT, apiConnect, rippleAPI)]);
}
