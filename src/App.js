import React, { Component } from 'react';
import store from './redux';
import { Provider } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LockScreen from './containers/LockedScreen';
import HomeScreen from './containers/HomeScreen';
import Password from './containers/Password';
import Dashboard from './containers/Dashboard';

class App extends Component {
   render() {
      return (
         <Provider store={store}>
            <Router>
               <div>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/locked" component={LockScreen} />
                  <Route path="/password" component={Password} />
                  <Route path="/dashboard" component={Dashboard} />
               </div>
            </Router>
         </Provider>
      );
   }
}

export default App;
