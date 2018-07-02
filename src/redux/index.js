// import 'babel-polyfill';
import { combineReducers } from 'redux';
import configureStore from './ConfigureStore';
//import rootSaga from '../sagas';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
   xledg: require('./XledgRedux').reducer
});

const store = configureStore(reducers, null);

export default store;
