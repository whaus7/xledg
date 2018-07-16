import { takeLatest, all, take } from 'redux-saga/effects';
//import 'babel-polyfill';
import API from '../services/Api';
//import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */
import { ActionTypes } from '../redux/XledgRedux';

/* ------------- Sagas ------------- */

import { getGateways } from './XledgSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
//const api = DebugConfig.useFixtures ? FixtureAPI : API.create();
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
   yield all([takeLatest(ActionTypes.GET_GATEWAYS, getGateways, api)]);
}
