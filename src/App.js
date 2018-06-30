import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import PouchDB from 'pouchdb';

import LockScreen from './containers/LockedScreen';
import HomeScreen from './containers/HomeScreen';

function xledgReducer(state = 0, action) {
   switch (action.type) {
      case 'INCREMENT':
         return state + 1;
      case 'DECREMENT':
         return state - 1;
      default:
         return state;
   }
}

const initialState = {
   db: new PouchDB('xledg_db')
};

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(xledgReducer, initialState);

// TODO what does this do?
// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
//store.subscribe(() => console.log(store.getState()));

const Dashboard = () => (
   <div>
      <h2>Wallet Dashboard</h2>
   </div>
);

class App extends Component {
   render() {
      return (
         <Provider store={store}>
            <Router>
               <div>
                  {/*<div id={'header'} style={{ background: '#202020' }}>*/}
                  {/*<div style={{ padding: 15 }}>xLedg</div>*/}
                  {/*<div />*/}
                  {/*</div>*/}

                  <Route exact path="/" component={HomeScreen} />
                  <Route path="/locked" component={LockScreen} />
                  <Route path="/dashboard" component={Dashboard} />
               </div>
            </Router>
         </Provider>
      );
   }
}

export default App;
